const mysql = require('mysql2/promise');
const { UserFacingError } = require('./errors');
const { getDatabaseConfig } = require('./config');

const MAX_COMPONENT_OPTIONS = 25;
const ALLOWED_COLORS = new Set(['gray', 'green', 'blue', 'purple', 'yellow']);
const SUPPORTED_LOCALES = new Set(['ko', 'en']);
const FEATURE_KEYS = ['dice', 'fortune', 'gacha', 'emoji'];

let pool;

function getPool() {
    if (!pool) {
        const config = getDatabaseConfig();
        pool = mysql.createPool({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
            waitForConnections: true,
            connectionLimit: 10,
            dateStrings: true,
            supportBigNumbers: true,
            bigNumberStrings: true
        });
    }
    return pool;
}

async function closePool() {
    if (!pool) return;
    const activePool = pool;
    pool = undefined;
    await activePool.end();
}

function defaultGuildSettings() {
    return {
        locale: 'ko',
        features: Object.fromEntries(FEATURE_KEYS.map(key => [key, true]))
    };
}

async function getGuildSettings(guildId) {
    if (!guildId) return defaultGuildSettings();
    const settings = defaultGuildSettings();
    const [rows] = await getPool().execute(
        `SELECT gs.locale, gf.feature_key, gf.enabled
         FROM guild_settings gs
         LEFT JOIN guild_features gf ON gf.guild_id = gs.guild_id
         WHERE gs.guild_id = ?`,
        [guildId]
    );
    if (!rows[0]) return settings;

    settings.locale = rows[0].locale;
    for (const row of rows) {
        if (row.feature_key) settings.features[row.feature_key] = Boolean(row.enabled);
    }
    return settings;
}

async function ensureGuildSettings(connection, guildId, actorId) {
    await connection.execute(
        `INSERT INTO guild_settings (guild_id, locale, updated_by)
         VALUES (?, 'ko', ?) ON DUPLICATE KEY UPDATE guild_id = guild_id`,
        [guildId, actorId]
    );
}

async function writeSettingsAudit(connection, guildId, actorId, action, details) {
    await connection.execute(
        'INSERT INTO guild_settings_audit (guild_id, actor_id, action, details) VALUES (?, ?, ?, ?)',
        [guildId, actorId, action, JSON.stringify(details)]
    );
}

async function setGuildLocale(guildId, actorId, locale) {
    if (!SUPPORTED_LOCALES.has(locale)) throw new Error(`Unsupported locale: ${locale}`);
    await withTransaction(async connection => {
        await ensureGuildSettings(connection, guildId, actorId);
        await connection.execute(
            'UPDATE guild_settings SET locale = ?, updated_by = ? WHERE guild_id = ?',
            [locale, actorId, guildId]
        );
        await writeSettingsAudit(connection, guildId, actorId, 'locale_changed', { locale });
    });
    return locale;
}

async function toggleGuildFeature(guildId, actorId, featureKey) {
    if (!FEATURE_KEYS.includes(featureKey)) throw new Error(`Unsupported feature: ${featureKey}`);
    return withTransaction(async connection => {
        await ensureGuildSettings(connection, guildId, actorId);
        await connection.execute(
            `INSERT INTO guild_features (guild_id, feature_key, enabled, updated_by)
             VALUES (?, ?, FALSE, ?)
             ON DUPLICATE KEY UPDATE enabled = NOT enabled, updated_by = VALUES(updated_by)`,
            [guildId, featureKey, actorId]
        );
        const [rows] = await connection.execute(
            'SELECT enabled FROM guild_features WHERE guild_id = ? AND feature_key = ?',
            [guildId, featureKey]
        );
        const enabled = Boolean(rows[0].enabled);
        await writeSettingsAudit(connection, guildId, actorId, 'feature_toggled', { featureKey, enabled });
        return enabled;
    });
}

async function resetGuildSettings(guildId, actorId) {
    await withTransaction(async connection => {
        await connection.execute('DELETE FROM guild_settings WHERE guild_id = ?', [guildId]);
        await writeSettingsAudit(connection, guildId, actorId, 'settings_reset', {});
    });
    return defaultGuildSettings();
}

async function withTransaction(callback) {
    const connection = await getPool().getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

function validateName(name, labelKey) {
    if (!name || !name.trim()) throw new UserFacingError('name_required', { labelKey });
}

async function getUser(userId) {
    const [rows] = await getPool().execute('SELECT id, last_fortune FROM users WHERE id = ?', [userId]);
    return rows[0] || null;
}

async function getOrCreateUser(userId) {
    await getPool().execute('INSERT IGNORE INTO users (id) VALUES (?)', [userId]);
    return getUser(userId);
}

async function recordDailyFortune(userId, date) {
    return withTransaction(async connection => {
        await connection.execute('INSERT IGNORE INTO users (id) VALUES (?)', [userId]);
        const [rows] = await connection.execute(
            'SELECT last_fortune FROM users WHERE id = ? FOR UPDATE',
            [userId]
        );

        if (rows[0].last_fortune === date) return null;

        await connection.execute('UPDATE users SET last_fortune = ? WHERE id = ?', [date, userId]);
        return { last_fortune: date };
    });
}

async function listGachasByOwner(ownerId) {
    const [rows] = await getPool().execute(
        'SELECT id, owner_id, gacha_name FROM gachas WHERE owner_id = ? ORDER BY id',
        [ownerId]
    );
    return rows;
}

async function getGacha(gachaId) {
    const [rows] = await getPool().execute('SELECT id, owner_id, gacha_name FROM gachas WHERE id = ?', [gachaId]);
    return rows[0] || null;
}

async function requireOwnedGacha(gachaId, ownerId, connection = getPool()) {
    const [rows] = await connection.execute(
        'SELECT id, owner_id, gacha_name FROM gachas WHERE id = ? AND owner_id = ?',
        [gachaId, ownerId]
    );
    if (!rows[0]) throw new UserFacingError('gacha_not_owned');
    return rows[0];
}

async function createGacha(ownerId, name) {
    validateName(name, 'gacha_label');
    return withTransaction(async connection => {
        const [countRows] = await connection.execute(
            'SELECT COUNT(*) AS count FROM gachas WHERE owner_id = ? FOR UPDATE',
            [ownerId]
        );
        if (Number(countRows[0].count) >= MAX_COMPONENT_OPTIONS) {
            throw new UserFacingError('gacha_limit', { maximum: MAX_COMPONENT_OPTIONS });
        }
        try {
            const [result] = await connection.execute(
                'INSERT INTO gachas (owner_id, gacha_name) VALUES (?, ?)',
                [ownerId, name]
            );
            return String(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('duplicate_gacha');
            throw error;
        }
    });
}

async function deleteGacha(gachaId, ownerId) {
    return withTransaction(async connection => {
        await requireOwnedGacha(gachaId, ownerId, connection);
        await connection.execute('DELETE FROM gachas WHERE id = ? AND owner_id = ?', [gachaId, ownerId]);
    });
}

async function listGrades(gachaId) {
    const [rows] = await getPool().execute(
        'SELECT id, gacha_id, grade_name, percentage, color FROM grades WHERE gacha_id = ? ORDER BY id',
        [gachaId]
    );
    return rows;
}

async function requireOwnedGrade(gradeId, ownerId, connection = getPool()) {
    const [rows] = await connection.execute(
        `SELECT gr.id, gr.gacha_id, gr.grade_name, gr.percentage, gr.color
         FROM grades gr JOIN gachas ga ON ga.id = gr.gacha_id
         WHERE gr.id = ? AND ga.owner_id = ?`,
        [gradeId, ownerId]
    );
    if (!rows[0]) throw new UserFacingError('grade_not_owned');
    return rows[0];
}

function validateGrade(percentage, color) {
    if (!Number.isInteger(percentage) || percentage < 1 || percentage > 100) {
        throw new UserFacingError('invalid_percentage');
    }
    if (!ALLOWED_COLORS.has(color)) {
        throw new UserFacingError('invalid_color');
    }
}

async function createGrade(gachaId, ownerId, { name, percentage, color }) {
    validateName(name, 'grade_label');
    validateGrade(percentage, color);
    return withTransaction(async connection => {
        await requireOwnedGacha(gachaId, ownerId, connection);
        const [grades] = await connection.execute(
            'SELECT percentage FROM grades WHERE gacha_id = ? FOR UPDATE',
            [gachaId]
        );
        if (grades.length >= MAX_COMPONENT_OPTIONS) {
            throw new UserFacingError('grade_limit', { maximum: MAX_COMPONENT_OPTIONS });
        }
        const total = grades.reduce((sum, grade) => sum + Number(grade.percentage), 0);
        if (total + percentage > 100) throw new UserFacingError('percentage_limit');
        try {
            await connection.execute(
                'INSERT INTO grades (gacha_id, grade_name, percentage, color) VALUES (?, ?, ?, ?)',
                [gachaId, name, percentage, color]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('duplicate_grade');
            throw error;
        }
    });
}

async function updateGrade(gradeId, ownerId, { name, percentage, color }) {
    validateName(name, 'grade_label');
    validateGrade(percentage, color);
    return withTransaction(async connection => {
        const grade = await requireOwnedGrade(gradeId, ownerId, connection);
        const [grades] = await connection.execute(
            'SELECT id, percentage FROM grades WHERE gacha_id = ? FOR UPDATE',
            [grade.gacha_id]
        );
        const total = grades.reduce(
            (sum, current) => sum + (String(current.id) === String(gradeId) ? 0 : Number(current.percentage)),
            0
        );
        if (total + percentage > 100) throw new UserFacingError('percentage_limit');
        try {
            await connection.execute(
                'UPDATE grades SET grade_name = ?, percentage = ?, color = ? WHERE id = ?',
                [name, percentage, color, gradeId]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('duplicate_grade');
            throw error;
        }
    });
}

async function deleteGrade(gradeId, ownerId) {
    return withTransaction(async connection => {
        await requireOwnedGrade(gradeId, ownerId, connection);
        await connection.execute('DELETE FROM grades WHERE id = ?', [gradeId]);
    });
}

async function listItems(gradeId) {
    const [rows] = await getPool().execute(
        'SELECT id, grade_id, item_name, item_description FROM items WHERE grade_id = ? ORDER BY id',
        [gradeId]
    );
    return rows;
}

async function requireOwnedItem(itemId, ownerId, connection = getPool()) {
    const [rows] = await connection.execute(
        `SELECT i.id, i.grade_id, i.item_name, i.item_description
         FROM items i
         JOIN grades gr ON gr.id = i.grade_id
         JOIN gachas ga ON ga.id = gr.gacha_id
         WHERE i.id = ? AND ga.owner_id = ?`,
        [itemId, ownerId]
    );
    if (!rows[0]) throw new UserFacingError('item_not_owned');
    return rows[0];
}

async function createItem(gradeId, ownerId, { name, description }) {
    validateName(name, 'item_label');
    return withTransaction(async connection => {
        await requireOwnedGrade(gradeId, ownerId, connection);
        const [countRows] = await connection.execute(
            'SELECT COUNT(*) AS count FROM items WHERE grade_id = ? FOR UPDATE',
            [gradeId]
        );
        if (Number(countRows[0].count) >= MAX_COMPONENT_OPTIONS) {
            throw new UserFacingError('item_limit', { maximum: MAX_COMPONENT_OPTIONS });
        }
        try {
            await connection.execute(
                'INSERT INTO items (grade_id, item_name, item_description) VALUES (?, ?, ?)',
                [gradeId, name, description || null]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('duplicate_item');
            throw error;
        }
    });
}

async function updateItem(itemId, ownerId, { name, description }) {
    validateName(name, 'item_label');
    return withTransaction(async connection => {
        await requireOwnedItem(itemId, ownerId, connection);
        try {
            await connection.execute(
                'UPDATE items SET item_name = ?, item_description = ? WHERE id = ?',
                [name, description || null, itemId]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('duplicate_item');
            throw error;
        }
    });
}

async function deleteItem(itemId, ownerId) {
    return withTransaction(async connection => {
        await requireOwnedItem(itemId, ownerId, connection);
        await connection.execute('DELETE FROM items WHERE id = ?', [itemId]);
    });
}

module.exports = {
    MAX_COMPONENT_OPTIONS,
    FEATURE_KEYS,
    closePool,
    getGuildSettings,
    setGuildLocale,
    toggleGuildFeature,
    resetGuildSettings,
    getUser,
    getOrCreateUser,
    recordDailyFortune,
    listGachasByOwner,
    getGacha,
    requireOwnedGacha,
    createGacha,
    deleteGacha,
    listGrades,
    requireOwnedGrade,
    createGrade,
    updateGrade,
    deleteGrade,
    listItems,
    requireOwnedItem,
    createItem,
    updateItem,
    deleteItem
};

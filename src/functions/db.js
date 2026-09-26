const mysql = require('mysql2/promise');
const { UserFacingError } = require('./errors');
const { getDatabaseConfig } = require('./config');

const MAX_COMPONENT_OPTIONS = 25;
const ALLOWED_COLORS = new Set(['gray', 'green', 'blue', 'purple', 'yellow']);

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

function validateName(name, label) {
    if (!name || !name.trim()) throw new UserFacingError(`${label} 이름을 입력해 주세요.`);
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
    if (!rows[0]) throw new UserFacingError('해당 가챠를 찾을 수 없거나 관리 권한이 없습니다.');
    return rows[0];
}

async function createGacha(ownerId, name) {
    validateName(name, '가챠');
    return withTransaction(async connection => {
        const [countRows] = await connection.execute(
            'SELECT COUNT(*) AS count FROM gachas WHERE owner_id = ? FOR UPDATE',
            [ownerId]
        );
        if (Number(countRows[0].count) >= MAX_COMPONENT_OPTIONS) {
            throw new UserFacingError(`가챠는 사용자당 최대 ${MAX_COMPONENT_OPTIONS}개까지 만들 수 있습니다.`);
        }
        try {
            const [result] = await connection.execute(
                'INSERT INTO gachas (owner_id, gacha_name) VALUES (?, ?)',
                [ownerId, name]
            );
            return String(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('같은 이름의 가챠가 이미 있습니다.');
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
    if (!rows[0]) throw new UserFacingError('해당 등급을 찾을 수 없거나 관리 권한이 없습니다.');
    return rows[0];
}

function validateGrade(percentage, color) {
    if (!Number.isInteger(percentage) || percentage < 1 || percentage > 100) {
        throw new UserFacingError('등급 확률은 1부터 100 사이의 정수여야 합니다.');
    }
    if (!ALLOWED_COLORS.has(color)) {
        throw new UserFacingError('색상은 gray, green, blue, purple, yellow 중 하나여야 합니다.');
    }
}

async function createGrade(gachaId, ownerId, { name, percentage, color }) {
    validateName(name, '등급');
    validateGrade(percentage, color);
    return withTransaction(async connection => {
        await requireOwnedGacha(gachaId, ownerId, connection);
        const [grades] = await connection.execute(
            'SELECT percentage FROM grades WHERE gacha_id = ? FOR UPDATE',
            [gachaId]
        );
        if (grades.length >= MAX_COMPONENT_OPTIONS) {
            throw new UserFacingError(`등급은 가챠당 최대 ${MAX_COMPONENT_OPTIONS}개까지 만들 수 있습니다.`);
        }
        const total = grades.reduce((sum, grade) => sum + Number(grade.percentage), 0);
        if (total + percentage > 100) throw new UserFacingError('전체 등급 확률의 합은 100%를 넘을 수 없습니다.');
        try {
            await connection.execute(
                'INSERT INTO grades (gacha_id, grade_name, percentage, color) VALUES (?, ?, ?, ?)',
                [gachaId, name, percentage, color]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('같은 이름의 등급이 이미 있습니다.');
            throw error;
        }
    });
}

async function updateGrade(gradeId, ownerId, { name, percentage, color }) {
    validateName(name, '등급');
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
        if (total + percentage > 100) throw new UserFacingError('전체 등급 확률의 합은 100%를 넘을 수 없습니다.');
        try {
            await connection.execute(
                'UPDATE grades SET grade_name = ?, percentage = ?, color = ? WHERE id = ?',
                [name, percentage, color, gradeId]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('같은 이름의 등급이 이미 있습니다.');
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
    if (!rows[0]) throw new UserFacingError('해당 아이템을 찾을 수 없거나 관리 권한이 없습니다.');
    return rows[0];
}

async function createItem(gradeId, ownerId, { name, description }) {
    validateName(name, '아이템');
    return withTransaction(async connection => {
        await requireOwnedGrade(gradeId, ownerId, connection);
        const [countRows] = await connection.execute(
            'SELECT COUNT(*) AS count FROM items WHERE grade_id = ? FOR UPDATE',
            [gradeId]
        );
        if (Number(countRows[0].count) >= MAX_COMPONENT_OPTIONS) {
            throw new UserFacingError(`아이템은 등급당 최대 ${MAX_COMPONENT_OPTIONS}개까지 만들 수 있습니다.`);
        }
        try {
            await connection.execute(
                'INSERT INTO items (grade_id, item_name, item_description) VALUES (?, ?, ?)',
                [gradeId, name, description || null]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('같은 이름의 아이템이 이미 있습니다.');
            throw error;
        }
    });
}

async function updateItem(itemId, ownerId, { name, description }) {
    validateName(name, '아이템');
    return withTransaction(async connection => {
        await requireOwnedItem(itemId, ownerId, connection);
        try {
            await connection.execute(
                'UPDATE items SET item_name = ?, item_description = ? WHERE id = ?',
                [name, description || null, itemId]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new UserFacingError('같은 이름의 아이템이 이미 있습니다.');
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
    closePool,
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

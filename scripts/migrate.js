const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const { getDatabaseConfig } = require('../src/functions/config');

async function migrate() {
    const connection = await mysql.createConnection({
        ...getDatabaseConfig(),
        multipleStatements: true
    });

    try {
        const [[lock]] = await connection.query("SELECT GET_LOCK('nova_schema_migrations', 30) AS acquired");
        if (lock.acquired !== 1) throw new Error('Could not acquire the database migration lock.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                checksum CHAR(64) NOT NULL,
                applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const directory = path.join(__dirname, '..', 'migrations');
        const files = (await fs.readdir(directory)).filter(file => file.endsWith('.sql')).sort();

        for (const file of files) {
            const sql = await fs.readFile(path.join(directory, file), 'utf8');
            const checksum = crypto.createHash('sha256').update(sql).digest('hex');
            const [rows] = await connection.execute(
                'SELECT checksum FROM schema_migrations WHERE version = ?',
                [file]
            );

            if (rows[0]) {
                if (rows[0].checksum !== checksum) throw new Error(`Applied migration was modified: ${file}`);
                continue;
            }

            await connection.query(sql);
            await connection.execute(
                'INSERT INTO schema_migrations (version, checksum) VALUES (?, ?)',
                [file, checksum]
            );
            console.log(`Applied migration: ${file}`);
        }
    } finally {
        await connection.query("SELECT RELEASE_LOCK('nova_schema_migrations')").catch(() => {});
        await connection.end();
    }
}

migrate().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

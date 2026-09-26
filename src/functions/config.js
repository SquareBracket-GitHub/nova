require('dotenv').config();

function required(name) {
    const value = process.env[name];
    if (!value || !value.trim()) throw new Error(`Missing required environment variable: ${name}`);
    return value.trim();
}

function getBotConfig() {
    const environment = (process.env.BOT_ENV || 'test').toLowerCase();
    const commandMode = required('COMMAND_MODE').toUpperCase();

    if (!['test', 'production'].includes(environment)) {
        throw new Error('BOT_ENV must be test or production.');
    }
    if (!['GUILD', 'GLOBAL'].includes(commandMode)) {
        throw new Error('COMMAND_MODE must be GUILD or GLOBAL.');
    }
    if (environment === 'test' && commandMode !== 'GUILD') {
        throw new Error('The test bot must use GUILD command mode.');
    }

    return {
        environment,
        commandMode,
        token: required('TOKEN'),
        clientId: required('CLIENT_ID'),
        guildId: commandMode === 'GUILD' ? required('GUILD_ID') : null
    };
}

function getDatabaseConfig() {
    const port = Number(process.env.DB_PORT || 3306);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('DB_PORT must be a valid TCP port.');
    }

    return {
        host: required('DB_HOST'),
        port,
        user: required('DB_USER'),
        password: required('DB_PW'),
        database: required('DB_NAME')
    };
}

module.exports = { getBotConfig, getDatabaseConfig };

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getBotConfig, getDatabaseConfig } = require('../src/functions/config');

function withEnvironment(values, callback) {
    const previous = {};
    for (const [key, value] of Object.entries(values)) {
        previous[key] = process.env[key];
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }

    try {
        return callback();
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
}

test('test bot is restricted to guild commands', () => {
    withEnvironment({
        BOT_ENV: 'test',
        TOKEN: 'test-token',
        CLIENT_ID: 'test-client',
        COMMAND_MODE: 'GLOBAL',
        GUILD_ID: 'test-guild'
    }, () => {
        assert.throws(getBotConfig, /test bot must use GUILD command mode/);
    });
});

test('test bot requires a guild id', () => {
    withEnvironment({
        BOT_ENV: 'test',
        TOKEN: 'test-token',
        CLIENT_ID: 'test-client',
        COMMAND_MODE: 'GUILD',
        GUILD_ID: undefined
    }, () => {
        assert.throws(getBotConfig, /GUILD_ID/);
    });
});

test('production bot can use global commands without a guild id', () => {
    withEnvironment({
        BOT_ENV: 'production',
        TOKEN: 'production-token',
        CLIENT_ID: 'production-client',
        COMMAND_MODE: 'GLOBAL',
        GUILD_ID: undefined
    }, () => {
        assert.deepEqual(getBotConfig(), {
            environment: 'production',
            commandMode: 'GLOBAL',
            token: 'production-token',
            clientId: 'production-client',
            guildId: null
        });
    });
});

test('database port must be valid', () => {
    withEnvironment({ DB_PORT: 'invalid' }, () => {
        assert.throws(getDatabaseConfig, /DB_PORT/);
    });
});

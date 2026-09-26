const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function load(directory) {
    const target = path.join(__dirname, '..', 'src', directory);
    return fs.readdirSync(target)
        .filter(file => file.endsWith('.js'))
        .map(file => require(path.join(target, file)));
}

test('all interaction handlers expose an execute function and unique key', () => {
    for (const directory of ['commands', 'buttons', 'selects', 'modals']) {
        const handlers = load(directory);
        assert.ok(handlers.every(handler => typeof handler.execute === 'function'));
        const keys = directory === 'commands'
            ? handlers.map(handler => handler.data.toJSON().name)
            : handlers.map(handler => handler.id);
        assert.equal(new Set(keys).size, keys.length, `${directory} has duplicate keys`);
    }
});

test('all slash commands serialize to valid Discord command data', () => {
    const commands = load('commands').map(command => command.data.toJSON());
    assert.deepEqual(
        commands.map(command => command.name).sort(),
        ['dice', 'fortune', 'gacha-create', 'gacha-delete', 'gacha-manage', 'ping', 'profile', 'settings', 'special-dice'].sort()
    );
});

test('settings is a guild-only Manage Server command', () => {
    const command = load('commands').find(handler => handler.data.name === 'settings').data.toJSON();
    assert.equal(command.default_member_permissions, '32');
    assert.deepEqual(command.contexts, [0]);
    assert.deepEqual(command.integration_types, [0]);
});

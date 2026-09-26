const assert = require('node:assert/strict');
const test = require('node:test');
const { settingsView } = require('../src/functions/settingsUi');

test('feature summary uses code labels without state emoji', () => {
    const view = settingsView({
        locale: 'en',
        features: { dice: true, fortune: false, gacha: true, emoji: false }
    });
    const description = view.embeds[0].toJSON().fields[1].value;

    assert.match(description, /`Dice` — Enabled/);
    assert.match(description, /`Fortune` — Disabled/);
    assert.doesNotMatch(description, /✅|⬜/);
});

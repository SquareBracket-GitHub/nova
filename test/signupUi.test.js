const assert = require('node:assert/strict');
const test = require('node:test');
const { signupView } = require('../src/functions/signupUi');

function signup(overrides = {}) {
    return {
        id: '17',
        creatorId: '100',
        title: 'Friday game',
        details: 'Starts at 8 PM',
        capacity: 2,
        closed: false,
        createdAtMs: 1_800_000_000_000,
        participants: [],
        ...overrides
    };
}

test('signup view shows organizer, details and localized action buttons', () => {
    const view = signupView({ novaSettings: { locale: 'ko' } }, signup());
    const embed = view.embeds[0].toJSON();
    const buttons = view.components[0].toJSON().components;

    assert.equal(embed.title, 'Friday game');
    assert.equal(embed.description, 'Starts at 8 PM');
    assert.equal(embed.fields[1].value, '<@100>');
    assert.deepEqual(buttons.map(button => button.label), ['참가', '참가 취소', '모집 마감']);
    assert.equal(new Set(buttons.map(button => button.custom_id)).size, 3);
});

test('full signup disables joining but still allows leaving', () => {
    const buttons = signupView(
        { novaSettings: { locale: 'en' } },
        signup({ participants: ['200', '300'] })
    ).components[0].toJSON().components;

    assert.equal(buttons[0].disabled, true);
    assert.notEqual(buttons[1].disabled, true);
});

test('closed signup disables every action', () => {
    const view = signupView(
        { novaSettings: { locale: 'ko' } },
        signup({ closed: true, participants: ['200'] })
    );
    const embed = view.embeds[0].toJSON();
    const buttons = view.components[0].toJSON().components;

    assert.match(embed.fields[0].value, /모집 마감/);
    assert.ok(buttons.every(button => button.disabled));
});

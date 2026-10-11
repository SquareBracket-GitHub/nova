const assert = require('node:assert/strict');
const test = require('node:test');
const { messages: ko } = require('../src/locales/ko');
const { messages: en } = require('../src/locales/en');

const ranges = [
    [1, 1], [2, 2], [3, 9], [10, 14], [15, 19], [20, 29], [30, 39],
    [40, 44], [45, 49], [50, 59], [60, 66], [67, 67], [68, 69],
    [70, 74], [75, 79], [80, 84], [85, 89], [90, 93], [94, 98], [99, 99], [100, 100]
];

test('fortune renders every saved score in its range and preserves repeat privacy', async () => {
    const dbPath = require.resolve('../src/functions/db');
    const randomPath = require.resolve('../src/functions/random');
    const commandPath = require.resolve('../src/commands/fortune');
    const originalDb = require.cache[dbPath];
    const originalRandom = require.cache[randomPath];
    let saved;
    require.cache[dbPath] = { exports: { recordDailyFortune: async () => saved } };
    // The displayed score must come from the stored result, not this new roll.
    require.cache[randomPath] = { exports: { rollDice: () => ({ total: 50 }) } };
    try {
        const command = require(commandPath);
        for (const [locale, messages] of [['ko', ko], ['en', en]]) {
            for (const [minimum, maximum] of ranges) {
                const message = messages[`fortune_${maximum}`];
                assert.ok(message, `${locale}: ${minimum}-${maximum}`);
                for (let score = minimum; score <= maximum; score++) {
                    for (const created of [true, false]) {
                        saved = { score, created, checkedAtMs: Date.UTC(2026, 9, 12) };
                        let reply;
                        await command.execute({
                            novaSettings: { locale },
                            user: { id: 'user', username: 'Tester', displayAvatarURL: () => 'https://example.com/avatar.png' },
                            reply: async value => { reply = value; }
                        });
                        const embed = reply.embeds[0].toJSON();
                        assert.equal(embed.description, `> ${score}\n\n${message}`);
                        assert.equal(reply.ephemeral, !created);
                        assert.equal(Boolean(embed.footer), !created);
                    }
                }
            }
        }
        assert.equal(ko.fortune_67, '**Six Seven**');
        assert.ok(ko.fortune_100.includes('보였다.\n사람들이'));
    } finally {
        delete require.cache[commandPath];
        if (originalDb) require.cache[dbPath] = originalDb;
        else delete require.cache[dbPath];
        if (originalRandom) require.cache[randomPath] = originalRandom;
        else delete require.cache[randomPath];
    }
});

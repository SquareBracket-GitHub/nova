const assert = require('node:assert/strict');
const test = require('node:test');
const { activityScore, meView, rankProgress } = require('../src/functions/meUi');
const { t } = require('../src/functions/i18n');

const interaction = {
    user: {
        username: 'NovaUser',
        displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    novaSettings: { locale: 'ko' }
};

const stats = {
    first_seen_at_ms: 1_700_000_000_000,
    command_uses: 12,
    dice_rolls: 20,
    gacha_pulls: 30,
    fortune_checks: 4,
    last_fortune: '2026-09-27',
    last_fortune_score: 88,
    gacha_count: 2,
    grade_count: 5,
    item_count: 16
};

test('activity score combines commands, dice and gacha pulls', () => {
    assert.equal(activityScore(stats), 62);
    assert.equal(rankProgress(interaction, 62).name, t(interaction, 'me_rank_navigator'));
});

test('me embed shows rewarding activity and collection fields', () => {
    const json = meView(interaction, stats).toJSON();
    const values = Object.fromEntries(json.fields.map(field => [field.name, field.value]));

    assert.equal(json.author.name, t(interaction, 'me_author', { username: 'NovaUser' }));
    assert.match(values[t(interaction, 'me_gacha_collection')], /2\/25/);
    assert.match(values[t(interaction, 'me_gacha_collection')], /5.*16/);
    assert.match(values[t(interaction, 'me_fortune')], /88/);
});

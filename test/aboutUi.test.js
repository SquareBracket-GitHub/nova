const assert = require('node:assert/strict');
const test = require('node:test');
const { ABOUT_COMMANDS, aboutView, formatUptime } = require('../src/functions/aboutUi');

const client = {
    uptime: 90_061_000,
    ws: { ping: 42 },
    user: { displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png' }
};

test('about guide contains one page for every command plus intro and status', () => {
    const source = { novaSettings: { locale: 'ko' } };
    const lastPage = ABOUT_COMMANDS.length + 1;
    const first = aboutView(source, client, 0, '123');
    const last = aboutView(source, client, lastPage, '123');

    assert.equal(first.embeds[0].toJSON().footer.text, `1 / ${ABOUT_COMMANDS.length + 2}`);
    assert.equal(last.embeds[0].toJSON().title, 'NOVA 상태');
    assert.equal(last.embeds[0].toJSON().fields[2].value, '42 ms');
});

test('every navigation row uses unique custom ids, including boundary pages', () => {
    const source = { novaSettings: { locale: 'ko' } };
    const total = ABOUT_COMMANDS.length + 2;

    for (let page = 0; page < total; page += 1) {
        const components = aboutView(source, client, page, '123').components[0].toJSON().components;
        const customIds = components.map(component => component.custom_id);
        assert.equal(new Set(customIds).size, customIds.length, `duplicate custom id on page ${page}`);
    }
});

test('gacha import page documents exact CSV headers and JSON keys', () => {
    const source = { novaSettings: { locale: 'ko' } };
    const page = ABOUT_COMMANDS.indexOf('gacha-import') + 1;
    const embed = aboutView(source, client, page, '123').embeds[0].toJSON();
    const details = embed.fields[2].value;

    assert.match(details, /gacha_name,grade_name,percentage,color,item_name,item_description/);
    assert.match(details, /"name".*"grades".*"percentage".*"color".*"items"/);
    assert.match(details, /256KB/);
});

test('about guide includes the export, random, and embed command pages', () => {
    assert.ok(ABOUT_COMMANDS.includes('gacha-export'));
    assert.ok(ABOUT_COMMANDS.includes('random'));
    assert.ok(ABOUT_COMMANDS.includes('embed'));
});

test('uptime is formatted in Korean and English', () => {
    assert.equal(formatUptime(90_061_000, 'ko'), '1일 1시간 1분 1초');
    assert.equal(formatUptime(90_061_000, 'en'), '1d 1h 1m 1s');
});

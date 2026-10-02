const assert = require('node:assert/strict');
const test = require('node:test');
const { buildUserEmbed } = require('../src/functions/embed');

test('builds a custom embed with preset and hex-compatible properties', () => {
    const embed = buildUserEmbed({
        title: 'Nova update',
        description: '**Ready**',
        color: 'ffb347',
        url: 'https://example.com/update',
        image: 'https://example.com/image.png',
        thumbnail: 'https://example.com/thumb.png',
        author: 'Nova',
        footer: 'Release notes',
        timestamp: true
    }).toJSON();

    assert.equal(embed.title, 'Nova update');
    assert.equal(embed.description, '**Ready**');
    assert.equal(embed.color, 0xFFB347);
    assert.equal(embed.url, 'https://example.com/update');
    assert.equal(embed.image.url, 'https://example.com/image.png');
    assert.equal(embed.thumbnail.url, 'https://example.com/thumb.png');
    assert.equal(embed.author.name, 'Nova');
    assert.equal(embed.footer.text, 'Release notes');
    assert.ok(embed.timestamp);
});

test('uses the default color when an embed color is omitted', () => {
    assert.equal(buildUserEmbed({ description: 'Hello' }).toJSON().color, 0xFFFFFF);
});

test('rejects empty embeds, malformed URLs, and URLs without a title', () => {
    assert.throws(
        () => buildUserEmbed({ color: 'purple' }),
        error => error.translationKey === 'embed_empty'
    );
    assert.throws(
        () => buildUserEmbed({ description: 'Hello', image: 'javascript:alert(1)' }),
        error => error.translationKey === 'invalid_embed_url'
    );
    assert.throws(
        () => buildUserEmbed({ description: 'Hello', url: 'https://example.com' }),
        error => error.translationKey === 'embed_url_requires_title'
    );
});

test('rejects unsupported embed colors', () => {
    assert.throws(
        () => buildUserEmbed({ description: 'Hello', color: 'red' }),
        error => error.translationKey === 'invalid_color'
    );
});

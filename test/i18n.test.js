const assert = require('node:assert/strict');
const test = require('node:test');
const { localeOf, t, translations } = require('../src/functions/i18n');

test('server setting takes precedence over Discord client locale', () => {
    const source = { locale: 'en-US', novaSettings: { locale: 'ko' } };
    assert.equal(localeOf(source), 'ko');
    assert.equal(t(source, 'settings_language'), '언어');
});

test('English locale and template variables are rendered', () => {
    const source = { novaSettings: { locale: 'en' } };
    assert.equal(t(source, 'blank_percentage', { percentage: 35 }), '35% results in no prize.');
});

test('Korean and English catalogs contain the same keys', () => {
    assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.ko).sort());
});

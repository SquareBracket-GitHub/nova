const assert = require('node:assert/strict');
const test = require('node:test');
const { localeOf, t, translations } = require('../src/functions/i18n');
const ko = require('../src/locales/ko');
const en = require('../src/locales/en');

function objectShape(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return typeof value;
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, objectShape(value[key])]));
}

test('server setting takes precedence over Discord client locale', () => {
    const source = { locale: 'en-US', novaSettings: { locale: 'ko' } };
    assert.equal(localeOf(source), 'ko');
    assert.equal(t(source, 'settings_language'), '언어');
});

test('English locale and template variables are rendered', () => {
    const source = { novaSettings: { locale: 'en' } };
    assert.equal(t(source, 'blank_percentage', { percentage: 35 }), '35% is no prize.');
});

test('Korean and English catalogs contain the same keys', () => {
    assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.ko).sort());
    assert.deepEqual(objectShape(en.about), objectShape(ko.about));
});

test('Korean and English messages use the same template variables', () => {
    function variables(message) {
        return [...String(message).matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)]
            .map(match => match[1])
            .sort();
    }

    for (const key of Object.keys(ko.messages)) {
        assert.deepEqual(variables(en.messages[key]), variables(ko.messages[key]), key);
    }
});

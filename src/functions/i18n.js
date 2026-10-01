const { translations } = require('../locales/translations');

function localeOf(source) {
    const locale = source?.novaSettings?.locale || source?.locale || 'ko';
    return String(locale).toLowerCase().startsWith('en') ? 'en' : 'ko';
}

function t(source, key, variables = {}) {
    const locale = localeOf(source);
    let value = translations[locale]?.[key] || translations.ko[key] || key;
    for (const [name, replacement] of Object.entries(variables)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
}

module.exports = { translations, localeOf, t };

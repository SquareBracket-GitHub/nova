const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const { FEATURE_KEYS } = require('./db');
const { t } = require('./i18n');
const { BRAND_COLOR } = require('./ui');

function settingsView(settings) {
    const context = { novaSettings: settings };
    const features = FEATURE_KEYS.map(key => {
        const state = settings.features[key] ? t(context, 'settings_enabled') : t(context, 'settings_disabled');
        return `\`${t(context, `feature_${key}`)}\` — ${state}`;
    }).join('\n');

    const embed = new EmbedBuilder()
        .setTitle(t(context, 'settings_title'))
        .setColor(BRAND_COLOR)
        .addFields(
            { name: t(context, 'settings_language'), value: t(context, `language_${settings.locale}`) },
            { name: t(context, 'settings_features'), value: features }
        );

    const language = new StringSelectMenuBuilder()
        .setCustomId('settingsLanguage')
        .setPlaceholder(t(context, 'settings_language_placeholder'))
        .addOptions(
            new StringSelectMenuOptionBuilder().setLabel('한국어').setValue('ko').setDefault(settings.locale === 'ko'),
            new StringSelectMenuOptionBuilder().setLabel('English').setValue('en').setDefault(settings.locale === 'en')
        );

    const featureButtons = FEATURE_KEYS.map(key => new ButtonBuilder()
        .setCustomId(`settingsFeature|${key}`)
        .setLabel(t(context, `feature_${key}`))
        .setStyle(settings.features[key] ? ButtonStyle.Success : ButtonStyle.Secondary));

    const reset = new ButtonBuilder()
        .setCustomId('settingsReset')
        .setLabel(t(context, 'settings_reset'))
        .setStyle(ButtonStyle.Danger);

    return {
        embeds: [embed],
        components: [
            new ActionRowBuilder().addComponents(language),
            new ActionRowBuilder().addComponents(featureButtons),
            new ActionRowBuilder().addComponents(reset)
        ]
    };
}

module.exports = { settingsView };

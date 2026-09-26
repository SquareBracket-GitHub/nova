const { setGuildLocale } = require('../functions/db');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { settingsView } = require('../functions/settingsUi');

module.exports = {
    id: 'settingsLanguage',
    hasExtraData: false,
    async execute(interaction) {
        assertSettingsAccess(interaction);
        await interaction.deferUpdate();
        const locale = await setGuildLocale(interaction.guildId, interaction.user.id, interaction.values[0]);
        const settings = interaction.novaSettings;
        settings.locale = locale;
        interaction.novaSettings = settings;
        await interaction.editReply(settingsView(settings));
    }
};

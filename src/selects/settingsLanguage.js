const { setGuildLocale } = require('../functions/db');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { settingsView } = require('../functions/settingsUi');

module.exports = {
    id: 'settingsLanguage',
    hasExtraData: false,
    async execute(interaction) {
        assertSettingsAccess(interaction);
        const settings = await setGuildLocale(interaction.guildId, interaction.user.id, interaction.values[0]);
        interaction.novaSettings = settings;
        await interaction.update(settingsView(settings));
    }
};

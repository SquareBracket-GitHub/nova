const { getGuildSettings } = require('../functions/db');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { settingsView } = require('../functions/settingsUi');

module.exports = {
    id: 'settingsResetCancel',
    hasExtraData: false,
    async execute(interaction) {
        assertSettingsAccess(interaction);
        const settings = await getGuildSettings(interaction.guildId);
        interaction.novaSettings = settings;
        await interaction.update(settingsView(settings));
    }
};

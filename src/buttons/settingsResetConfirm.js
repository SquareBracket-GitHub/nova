const { resetGuildSettings } = require('../functions/db');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { settingsView } = require('../functions/settingsUi');

module.exports = {
    id: 'settingsResetConfirm',
    hasExtraData: false,
    async execute(interaction) {
        assertSettingsAccess(interaction);
        const settings = await resetGuildSettings(interaction.guildId, interaction.user.id);
        interaction.novaSettings = settings;
        await interaction.update(settingsView(settings));
    }
};

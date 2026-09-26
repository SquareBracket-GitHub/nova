const { toggleGuildFeature, getGuildSettings } = require('../functions/db');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { settingsView } = require('../functions/settingsUi');

module.exports = {
    id: 'settingsFeature',
    hasExtraData: true,
    async execute(interaction) {
        assertSettingsAccess(interaction);
        const featureKey = interaction.customId.split('|')[1];
        await toggleGuildFeature(interaction.guildId, interaction.user.id, featureKey);
        const settings = await getGuildSettings(interaction.guildId);
        interaction.novaSettings = settings;
        await interaction.update(settingsView(settings));
    }
};

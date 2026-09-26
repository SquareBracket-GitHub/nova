const { toggleGuildFeature } = require('../functions/db');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { settingsView } = require('../functions/settingsUi');

module.exports = {
    id: 'settingsFeature',
    hasExtraData: true,
    async execute(interaction) {
        assertSettingsAccess(interaction);
        const featureKey = interaction.customId.split('|')[1];
        await interaction.deferUpdate();
        const enabled = await toggleGuildFeature(interaction.guildId, interaction.user.id, featureKey);
        const settings = interaction.novaSettings;
        settings.features[featureKey] = enabled;
        interaction.novaSettings = settings;
        await interaction.editReply(settingsView(settings));
    }
};

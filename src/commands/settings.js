const {
    ApplicationIntegrationType,
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} = require('discord.js');
const { getGuildSettings } = require('../functions/db');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { settingsView } = require('../functions/settingsUi');
const { describe } = require('../locales/commands');

module.exports = {
    data: describe(new SlashCommandBuilder().setName('settings'), 'settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

    async execute(interaction) {
        assertSettingsAccess(interaction);
        const settings = await getGuildSettings(interaction.guildId);
        interaction.novaSettings = settings;
        await interaction.reply({ ...settingsView(settings), flags: MessageFlags.Ephemeral });
    }
};

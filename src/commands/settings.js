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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Configure Nova for this server.')
        .setDescriptionLocalization('ko', '이 서버의 Nova 설정을 관리합니다.')
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

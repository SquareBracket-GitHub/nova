const {
    ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder
} = require('discord.js');
const { createSignup } = require('../functions/db');
const { signupView } = require('../functions/signupUi');
const { describe } = require('../locales/commands');

module.exports = {
    data: describe(new SlashCommandBuilder().setName('signup'), 'signup')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption(option => describe(option.setName('title'), 'signup', 'title')
            .setMinLength(1)
            .setMaxLength(100)
            .setRequired(true))
        .addStringOption(option => describe(option.setName('description'), 'signup', 'details')
            .setMaxLength(1_000))
        .addIntegerOption(option => describe(option.setName('capacity'), 'signup', 'capacity')
            .setMinValue(2)
            .setMaxValue(50)),

    async execute(interaction) {
        const signup = await createSignup({
            creatorId: interaction.user.id,
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            title: interaction.options.getString('title', true).trim(),
            details: interaction.options.getString('description')?.trim() || null,
            capacity: interaction.options.getInteger('capacity')
        });
        await interaction.reply(signupView(interaction, signup));
    }
};

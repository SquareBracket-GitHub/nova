const { SlashCommandBuilder } = require('discord.js');
const { getUserProfileStats } = require('../functions/db');
const { meView } = require('../functions/meUi');
const { describe } = require('../locales/commands');

module.exports = {
    data: describe(new SlashCommandBuilder().setName('me'), 'me'),

    async execute(interaction) {
        const stats = await getUserProfileStats(interaction.user.id);
        await interaction.reply({ embeds: [meView(interaction, stats)] });
    }
};

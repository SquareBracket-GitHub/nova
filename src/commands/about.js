const { SlashCommandBuilder } = require('discord.js');
const { aboutView } = require('../functions/aboutUi');
const { describe } = require('../locales/commands');

module.exports = {
    data: describe(new SlashCommandBuilder().setName('about'), 'about'),

    async execute(interaction, client) {
        await interaction.reply(aboutView(interaction, client, 0, interaction.user.id));
    }
};

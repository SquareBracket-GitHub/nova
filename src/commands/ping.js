const { SlashCommandBuilder } = require("discord.js");
const { describe } = require('../locales/commands');

module.exports = {
    /* Create a new SlashCommandBuilder object. */
    data: describe(new SlashCommandBuilder().setName('ping'), 'ping'),
     /* Execute the slash command when it is called by a user. */
    async execute(interaction) {
        await interaction.reply('**Pong!**');
    }
}

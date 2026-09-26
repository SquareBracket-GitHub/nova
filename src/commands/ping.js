const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    /* Create a new SlashCommandBuilder object. */
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replise wiht Pong!'),
     /* Execute the slash command when it is called by a user. */
    async execute(interaction) {
        await interaction.reply('**Pong!**');
    }
}
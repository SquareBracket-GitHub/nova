const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    /* Create a new SlashCommandBuilder object. */
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Reply with Pong!')
        .setDescriptionLocalization('ko', 'Pong으로 응답합니다.'),
     /* Execute the slash command when it is called by a user. */
    async execute(interaction) {
        await interaction.reply('**Pong!**');
    }
}

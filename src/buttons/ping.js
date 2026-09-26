module.exports = {
    id: 'ping', /* Unique ID for this button */
    hasExtraData: false,
    /* Execute the button's action when it is clicked by a user */
    async execute(interaction, client) {
        await interaction.reply('**Pong!**');
    }
}
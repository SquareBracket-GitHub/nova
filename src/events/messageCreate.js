const { EmbedBuilder, Events } = require('discord.js');
const { BRAND_COLOR } = require('../functions/ui');

module.exports = {
    event: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot || !message.deletable) return;

        const match = /^<(a?):[^:<>]+:([0-9]+)>$/.exec(message.content.trim());
        if (!match) return;

        const extension = match[1] === 'a' ? 'gif' : 'png';
        const embed = new EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setImage(`https://cdn.discordapp.com/emojis/${match[2]}.${extension}`)
            .setColor(BRAND_COLOR);

        if (message.reference?.messageId) {
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
            await repliedMessage.reply({ embeds: [embed] });
        } else {
            await message.channel.send({ embeds: [embed] });
        }

        await message.delete();
    }
};

const { MessageFlags } = require('discord.js');
const { aboutView } = require('../functions/aboutUi');
const { aboutCopy } = require('../locales/about');
const { localeOf } = require('../functions/i18n');

module.exports = {
    id: 'aboutPage',
    hasExtraData: true,

    async execute(interaction, client) {
        const [, rawPage, ownerId] = interaction.customId.split('|');
        if (interaction.user.id !== ownerId) {
            const context = aboutCopy[localeOf(interaction)];
            await interaction.reply({ content: context.notOwner, flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.update(aboutView(interaction, client, Number(rawPage), ownerId));
    }
};

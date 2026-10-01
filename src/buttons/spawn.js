const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { listGrades, requireOwnedGacha } = require('../functions/db');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'spawn',
    hasExtraData: true,
    async execute(interaction) {
        const [, rawCount, gachaId] = interaction.customId.split('|');
        const count = Number(rawCount);
        if (![1, 10].includes(count)) throw new Error('Invalid spin count.');
        const gacha = await requireOwnedGacha(gachaId, interaction.user.id);
        const grades = await listGrades(gachaId);
        if (!grades.length) {
            await interaction.reply({ content: t(interaction, 'spawn_requires_grade'), ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: t(interaction, 'gacha_author', { username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL() })
            .setTitle(`${gacha.gacha_name}${count === 10 ? ' (×10)' : ''}`)
            .setColor(BRAND_COLOR);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`spin|${count}|${gachaId}`).setLabel(t(interaction, 'spin')).setStyle(ButtonStyle.Success)
        );

        await interaction.deferUpdate();
        await interaction.channel.send({
            content: t(interaction, 'gacha_published', { userId: interaction.user.id }),
            embeds: [embed],
            components: [row]
        });
    }
};

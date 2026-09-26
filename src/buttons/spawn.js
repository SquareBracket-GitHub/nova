const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { listGrades, requireOwnedGacha } = require('../functions/db');
const { BRAND_COLOR } = require('../functions/ui');

module.exports = {
    id: 'spawn',
    hasExtraData: true,
    async execute(interaction) {
        const [, rawCount, gachaId] = interaction.customId.split('|');
        const count = Number(rawCount);
        if (![1, 10].includes(count)) throw new Error('Invalid spin count.');
        const gacha = await requireOwnedGacha(gachaId, interaction.user.id);
        const grades = await listGrades(gachaId);
        if (!grades.length) {
            await interaction.reply({ content: '가챠를 공개하기 전에 등급을 하나 이상 만들어 주세요.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}님의 가챠`, iconURL: interaction.user.displayAvatarURL() })
            .setTitle(`${gacha.gacha_name}${count === 10 ? ' (×10)' : ''}`)
            .setColor(BRAND_COLOR);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`spin|${count}|${gachaId}`).setLabel('Spin!').setStyle(ButtonStyle.Success)
        );

        await interaction.deferUpdate();
        await interaction.channel.send({
            content: `<@${interaction.user.id}>님이 가챠를 공개했습니다!`,
            embeds: [embed],
            components: [row]
        });
    }
};

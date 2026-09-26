const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { listItems, requireOwnedGrade } = require('../functions/db');
const { GRADE_COLORS, truncate } = require('../functions/ui');

module.exports = {
    id: 'selectGrade',
    hasExtraData: false,
    async execute(interaction) {
        const gradeId = interaction.values[0];
        const grade = await requireOwnedGrade(gradeId, interaction.user.id);
        const items = await listItems(gradeId);
        const description = items.length
            ? items.map(item => `- ${item.item_name}`).join('\n')
            : '아직 아이템이 없습니다.';

        const embed = new EmbedBuilder()
            .setTitle(`${grade.grade_name} (${grade.percentage}%)`)
            .setColor(GRADE_COLORS[grade.color])
            .setDescription(truncate(description, 4096));

        const editRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`createItem|${gradeId}`).setLabel('아이템 생성').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`modifyGrade|${gradeId}`).setLabel('등급 수정').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`modifyItem|${gradeId}`).setLabel('아이템 수정').setStyle(ButtonStyle.Secondary).setDisabled(!items.length)
        );
        const deleteRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`deleteGrade|${gradeId}`).setLabel('등급 삭제').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(`deleteItem|${gradeId}`).setLabel('아이템 삭제').setStyle(ButtonStyle.Danger).setDisabled(!items.length)
        );

        await interaction.reply({ embeds: [embed], components: [editRow, deleteRow], ephemeral: true });
    }
};

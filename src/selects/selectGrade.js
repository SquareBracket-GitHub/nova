const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { listItems, requireOwnedGrade } = require('../functions/db');
const { resolveGradeColor, truncate } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'selectGrade',
    hasExtraData: false,
    async execute(interaction) {
        const gradeId = interaction.values[0];
        const grade = await requireOwnedGrade(gradeId, interaction.user.id);
        const items = await listItems(gradeId);
        const description = items.length
            ? items.map(item => `- ${item.item_name}`).join('\n')
            : t(interaction, 'no_items');

        const embed = new EmbedBuilder()
            .setTitle(`${grade.grade_name} (${grade.percentage}%)`)
            .setColor(resolveGradeColor(grade.color))
            .setDescription(truncate(description, 4096));

        const editRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`createItem|${gradeId}`).setLabel(t(interaction, 'create_item')).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`modifyGrade|${gradeId}`).setLabel(t(interaction, 'modify_grade')).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`modifyItem|${gradeId}`).setLabel(t(interaction, 'modify_item')).setStyle(ButtonStyle.Secondary).setDisabled(!items.length)
        );
        const deleteRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`deleteGrade|${gradeId}`).setLabel(t(interaction, 'delete_grade')).setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(`deleteItem|${gradeId}`).setLabel(t(interaction, 'delete_item')).setStyle(ButtonStyle.Danger).setDisabled(!items.length)
        );

        await interaction.reply({ embeds: [embed], components: [editRow, deleteRow], ephemeral: true });
    }
};

const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedGrade } = require('../functions/db');
const { createModal } = require('../functions/modal');
const { truncate } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'modifyGrade',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        const grade = await requireOwnedGrade(gradeId, interaction.user.id);
        const modal = createModal(`modifyGradeModal|${gradeId}`, truncate(t(interaction, 'modify_grade_title', { name: grade.grade_name }), 45), [
            new TextInputBuilder().setCustomId('grade_name').setLabel(t(interaction, 'grade_name')).setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(40).setValue(grade.grade_name).setRequired(true),
            new TextInputBuilder().setCustomId('grade_percentage').setLabel(t(interaction, 'grade_percentage')).setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(3).setValue(String(grade.percentage)).setRequired(true),
            new TextInputBuilder().setCustomId('grade_color').setLabel(t(interaction, 'color')).setStyle(TextInputStyle.Short).setValue(grade.color).setRequired(true)
        ]);
        await interaction.showModal(modal);
    }
};

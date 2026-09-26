const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedGrade } = require('../functions/db');
const { createModal } = require('../functions/modal');
const { truncate } = require('../functions/ui');

module.exports = {
    id: 'modifyGrade',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        const grade = await requireOwnedGrade(gradeId, interaction.user.id);
        const modal = createModal(`modifyGradeModal|${gradeId}`, truncate(`등급 수정: ${grade.grade_name}`, 45), [
            new TextInputBuilder().setCustomId('grade_name').setLabel('등급 이름').setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(40).setValue(grade.grade_name).setRequired(true),
            new TextInputBuilder().setCustomId('grade_percentage').setLabel('등급 확률 (1~100)').setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(3).setValue(String(grade.percentage)).setRequired(true),
            new TextInputBuilder().setCustomId('grade_color').setLabel('색상').setStyle(TextInputStyle.Short).setValue(grade.color).setRequired(true)
        ]);
        await interaction.showModal(modal);
    }
};

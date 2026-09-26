const { updateGrade } = require('../functions/db');
const { UserFacingError } = require('../functions/errors');

function parsePercentage(value) {
    if (!/^[0-9]+$/.test(value)) throw new UserFacingError('등급 확률에는 정수만 입력할 수 있습니다.');
    return Number(value);
}

module.exports = {
    id: 'modifyGradeModal',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await updateGrade(gradeId, interaction.user.id, {
            name: interaction.fields.getTextInputValue('grade_name').trim(),
            percentage: parsePercentage(interaction.fields.getTextInputValue('grade_percentage').trim()),
            color: interaction.fields.getTextInputValue('grade_color').trim().toLowerCase()
        });
        await interaction.reply({ content: '등급을 수정했습니다.', ephemeral: true });
    }
};

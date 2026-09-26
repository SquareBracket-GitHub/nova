const { updateGrade } = require('../functions/db');
const { UserFacingError } = require('../functions/errors');
const { t } = require('../functions/i18n');

function parsePercentage(value) {
    if (!/^[0-9]+$/.test(value)) throw new UserFacingError('invalid_integer_percentage');
    return Number(value);
}

module.exports = {
    feature: 'gacha',
    id: 'modifyGradeModal',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await updateGrade(gradeId, interaction.user.id, {
            name: interaction.fields.getTextInputValue('grade_name').trim(),
            percentage: parsePercentage(interaction.fields.getTextInputValue('grade_percentage').trim()),
            color: interaction.fields.getTextInputValue('grade_color').trim().toLowerCase()
        });
        await interaction.reply({ content: t(interaction, 'grade_modified'), ephemeral: true });
    }
};

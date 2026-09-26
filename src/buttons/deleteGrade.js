const { deleteGrade } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'deleteGrade',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await deleteGrade(gradeId, interaction.user.id);
        await interaction.reply({ content: t(interaction, 'grade_deleted'), ephemeral: true });
    }
};

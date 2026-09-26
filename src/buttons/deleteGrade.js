const { deleteGrade } = require('../functions/db');

module.exports = {
    id: 'deleteGrade',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await deleteGrade(gradeId, interaction.user.id);
        await interaction.reply({ content: '등급과 포함된 아이템을 삭제했습니다.', ephemeral: true });
    }
};

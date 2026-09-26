const { deleteGacha } = require('../functions/db');

module.exports = {
    id: 'deleteGachaSelect',
    hasExtraData: false,
    async execute(interaction) {
        await deleteGacha(interaction.values[0], interaction.user.id);
        await interaction.update({ content: '가챠와 포함된 등급 및 아이템을 삭제했습니다.', components: [] });
    }
};

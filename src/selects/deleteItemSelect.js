const { deleteItem } = require('../functions/db');

module.exports = {
    id: 'deleteItemSelect',
    hasExtraData: true,
    async execute(interaction) {
        await deleteItem(interaction.values[0], interaction.user.id);
        await interaction.update({ content: '아이템을 삭제했습니다.', components: [] });
    }
};

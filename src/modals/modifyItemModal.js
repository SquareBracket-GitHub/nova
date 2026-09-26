const { updateItem } = require('../functions/db');

module.exports = {
    id: 'modifyItemModal',
    hasExtraData: true,
    async execute(interaction) {
        const itemId = interaction.customId.split('|')[1];
        await updateItem(itemId, interaction.user.id, {
            name: interaction.fields.getTextInputValue('item_name').trim(),
            description: interaction.fields.getTextInputValue('item_description').trim()
        });
        await interaction.reply({ content: '아이템을 수정했습니다.', ephemeral: true });
    }
};

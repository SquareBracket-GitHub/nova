const { createItem } = require('../functions/db');

module.exports = {
    id: 'createItemModal',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await createItem(gradeId, interaction.user.id, {
            name: interaction.fields.getTextInputValue('item_name').trim(),
            description: interaction.fields.getTextInputValue('item_description').trim()
        });
        await interaction.reply({ content: '아이템을 만들었습니다.', ephemeral: true });
    }
};

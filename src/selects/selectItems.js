const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedItem } = require('../functions/db');
const { createModal } = require('../functions/modal');
const { truncate } = require('../functions/ui');

module.exports = {
    id: 'selectItems',
    hasExtraData: true,
    async execute(interaction) {
        const item = await requireOwnedItem(interaction.values[0], interaction.user.id);
        const descriptionInput = new TextInputBuilder()
            .setCustomId('item_description')
            .setLabel('아이템 설명')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(150)
            .setRequired(false);
        if (item.item_description) descriptionInput.setValue(item.item_description);

        const modal = createModal(`modifyItemModal|${item.id}`, truncate(`아이템 수정: ${item.item_name}`, 45), [
            new TextInputBuilder()
                .setCustomId('item_name')
                .setLabel('아이템 이름')
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(40)
                .setValue(item.item_name)
                .setRequired(true),
            descriptionInput
        ]);
        await interaction.showModal(modal);
    }
};

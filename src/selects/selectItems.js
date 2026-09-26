const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedItem } = require('../functions/db');
const { createModal } = require('../functions/modal');
const { truncate } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'selectItems',
    hasExtraData: true,
    async execute(interaction) {
        const item = await requireOwnedItem(interaction.values[0], interaction.user.id);
        const descriptionInput = new TextInputBuilder()
            .setCustomId('item_description')
            .setLabel(t(interaction, 'item_description'))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(150)
            .setRequired(false);
        if (item.item_description) descriptionInput.setValue(item.item_description);

        const modal = createModal(`modifyItemModal|${item.id}`, truncate(t(interaction, 'modify_item_title', { name: item.item_name }), 45), [
            new TextInputBuilder()
                .setCustomId('item_name')
                .setLabel(t(interaction, 'item_name'))
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

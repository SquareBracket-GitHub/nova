const { updateItem } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'modifyItemModal',
    hasExtraData: true,
    async execute(interaction) {
        const itemId = interaction.customId.split('|')[1];
        await updateItem(itemId, interaction.user.id, {
            name: interaction.fields.getTextInputValue('item_name').trim(),
            description: interaction.fields.getTextInputValue('item_description').trim()
        });
        await interaction.reply({ content: t(interaction, 'item_modified'), ephemeral: true });
    }
};

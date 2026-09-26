const { createItem } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'createItemModal',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await createItem(gradeId, interaction.user.id, {
            name: interaction.fields.getTextInputValue('item_name').trim(),
            description: interaction.fields.getTextInputValue('item_description').trim()
        });
        await interaction.reply({ content: t(interaction, 'item_created'), ephemeral: true });
    }
};

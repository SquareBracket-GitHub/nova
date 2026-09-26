const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedGrade } = require('../functions/db');
const { createModal } = require('../functions/modal');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'createItem',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await requireOwnedGrade(gradeId, interaction.user.id);
        const modal = createModal(`createItemModal|${gradeId}`, t(interaction, 'create_item_title'), [
            new TextInputBuilder().setCustomId('item_name').setLabel(t(interaction, 'item_name')).setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(40).setRequired(true),
            new TextInputBuilder().setCustomId('item_description').setLabel(t(interaction, 'item_description')).setStyle(TextInputStyle.Paragraph).setMinLength(1).setMaxLength(150).setRequired(false)
        ]);
        await interaction.showModal(modal);
    }
};

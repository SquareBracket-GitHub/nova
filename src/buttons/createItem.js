const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedGrade } = require('../functions/db');
const { createModal } = require('../functions/modal');

module.exports = {
    id: 'createItem',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await requireOwnedGrade(gradeId, interaction.user.id);
        const modal = createModal(`createItemModal|${gradeId}`, '아이템 생성', [
            new TextInputBuilder().setCustomId('item_name').setLabel('아이템 이름').setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(40).setRequired(true),
            new TextInputBuilder().setCustomId('item_description').setLabel('아이템 설명').setStyle(TextInputStyle.Paragraph).setMinLength(1).setMaxLength(150).setRequired(false)
        ]);
        await interaction.showModal(modal);
    }
};

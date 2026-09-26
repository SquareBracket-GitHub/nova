const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedGacha } = require('../functions/db');
const { createModal } = require('../functions/modal');

module.exports = {
    id: 'createGrade',
    hasExtraData: true,
    async execute(interaction) {
        const gachaId = interaction.customId.split('|')[1];
        await requireOwnedGacha(gachaId, interaction.user.id);
        const modal = createModal(`createGradeModal|${gachaId}`, '등급 생성', [
            new TextInputBuilder().setCustomId('grade_name').setLabel('등급 이름').setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(40).setRequired(true),
            new TextInputBuilder().setCustomId('grade_percentage').setLabel('등급 확률 (1~100)').setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(3).setRequired(true),
            new TextInputBuilder().setCustomId('grade_color').setLabel('색상').setStyle(TextInputStyle.Short).setPlaceholder('gray, green, blue, purple, yellow').setRequired(true)
        ]);
        await interaction.showModal(modal);
    }
};

const { TextInputBuilder, TextInputStyle } = require('discord.js');
const { requireOwnedGacha } = require('../functions/db');
const { createModal } = require('../functions/modal');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'createGrade',
    hasExtraData: true,
    async execute(interaction) {
        const gachaId = interaction.customId.split('|')[1];
        await requireOwnedGacha(gachaId, interaction.user.id);
        const modal = createModal(`createGradeModal|${gachaId}`, t(interaction, 'create_grade_title'), [
            new TextInputBuilder().setCustomId('grade_name').setLabel(t(interaction, 'grade_name')).setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(40).setRequired(true),
            new TextInputBuilder().setCustomId('grade_percentage').setLabel(t(interaction, 'grade_percentage')).setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(3).setRequired(true),
            new TextInputBuilder().setCustomId('grade_color').setLabel(t(interaction, 'color')).setStyle(TextInputStyle.Short).setPlaceholder('gray, purple, #FFB347').setRequired(true)
        ]);
        await interaction.showModal(modal);
    }
};

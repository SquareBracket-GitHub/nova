const {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listGrades, requireOwnedGacha } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'showGrades',
    hasExtraData: true,
    async execute(interaction) {
        const gachaId = interaction.customId.split('|')[1];
        await requireOwnedGacha(gachaId, interaction.user.id);
        const grades = await listGrades(gachaId);
        if (!grades.length) {
            await interaction.reply({ content: t(interaction, 'no_grades'), ephemeral: true });
            return;
        }
        const select = new StringSelectMenuBuilder()
            .setCustomId('selectGrade')
            .setPlaceholder(t(interaction, 'choose_grade_placeholder'))
            .addOptions(grades.map(grade => new StringSelectMenuOptionBuilder()
                .setLabel(grade.grade_name)
                .setDescription(`${grade.percentage}%`)
                .setValue(String(grade.id))));
        await interaction.reply({
            content: t(interaction, 'choose_grade'),
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

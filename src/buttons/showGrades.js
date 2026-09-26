const {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listGrades, requireOwnedGacha } = require('../functions/db');

module.exports = {
    id: 'showGrades',
    hasExtraData: true,
    async execute(interaction) {
        const gachaId = interaction.customId.split('|')[1];
        await requireOwnedGacha(gachaId, interaction.user.id);
        const grades = await listGrades(gachaId);
        if (!grades.length) {
            await interaction.reply({ content: '아직 등급이 없습니다.', ephemeral: true });
            return;
        }
        const select = new StringSelectMenuBuilder()
            .setCustomId('selectGrade')
            .setPlaceholder('관리할 등급을 선택하세요.')
            .addOptions(grades.map(grade => new StringSelectMenuOptionBuilder()
                .setLabel(grade.grade_name)
                .setDescription(`${grade.percentage}%`)
                .setValue(String(grade.id))));
        await interaction.reply({
            content: '자세히 보거나 관리할 등급을 선택하세요.',
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

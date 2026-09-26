const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { listGrades, listItems, requireOwnedGacha } = require('../functions/db');
const { BRAND_COLOR, truncate } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'selectGacha',
    hasExtraData: false,
    async execute(interaction) {
        const gachaId = interaction.values[0];
        const gacha = await requireOwnedGacha(gachaId, interaction.user.id);
        const grades = await listGrades(gachaId);
        const embed = new EmbedBuilder().setTitle(gacha.gacha_name).setColor(BRAND_COLOR);

        if (!grades.length) {
            embed.setDescription(t(interaction, 'empty_gacha'));
        } else {
            let totalPercentage = 0;
            const fields = [];
            for (const grade of grades) {
                totalPercentage += Number(grade.percentage);
                const items = await listItems(grade.id);
                const value = items.length ? items.map(item => item.item_name).join('\n') : '-';
                fields.push({
                    name: `${grade.grade_name} (${grade.percentage}%)`,
                    value: truncate(value)
                });
            }
            embed.addFields(fields);
            if (totalPercentage < 100) embed.setFooter({ text: t(interaction, 'blank_percentage', { percentage: 100 - totalPercentage }) });
        }

        const manageRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`createGrade|${gachaId}`).setLabel(t(interaction, 'create_grade')).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`showGrades|${gachaId}`).setLabel(t(interaction, 'manage_grades')).setStyle(ButtonStyle.Secondary).setDisabled(!grades.length)
        );
        const spawnRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`spawn|1|${gachaId}`).setLabel(t(interaction, 'spawn_once')).setStyle(ButtonStyle.Success).setDisabled(!grades.length),
            new ButtonBuilder().setCustomId(`spawn|10|${gachaId}`).setLabel(t(interaction, 'spawn_ten')).setStyle(ButtonStyle.Success).setDisabled(!grades.length)
        );

        await interaction.update({ content: '', embeds: [embed], components: [manageRow, spawnRow] });
    }
};

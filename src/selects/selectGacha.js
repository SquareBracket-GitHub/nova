const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { listGrades, listItems, requireOwnedGacha } = require('../functions/db');
const { truncate } = require('../functions/ui');

module.exports = {
    id: 'selectGacha',
    hasExtraData: false,
    async execute(interaction) {
        const gachaId = interaction.values[0];
        const gacha = await requireOwnedGacha(gachaId, interaction.user.id);
        const grades = await listGrades(gachaId);
        const embed = new EmbedBuilder().setTitle(gacha.gacha_name).setColor('#BD31F2');

        if (!grades.length) {
            embed.setDescription('아직 등급과 아이템이 없습니다. 먼저 등급을 만들어 주세요.');
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
            if (totalPercentage < 100) embed.setFooter({ text: `${100 - totalPercentage}%는 꽝입니다.` });
        }

        const manageRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`createGrade|${gachaId}`).setLabel('등급 생성').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`showGrades|${gachaId}`).setLabel('등급 관리').setStyle(ButtonStyle.Secondary).setDisabled(!grades.length)
        );
        const spawnRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`spawn|1|${gachaId}`).setLabel('1회 가챠 공개').setStyle(ButtonStyle.Success).setDisabled(!grades.length),
            new ButtonBuilder().setCustomId(`spawn|10|${gachaId}`).setLabel('10회 가챠 공개').setStyle(ButtonStyle.Success).setDisabled(!grades.length)
        );

        await interaction.update({ content: '', embeds: [embed], components: [manageRow, spawnRow] });
    }
};

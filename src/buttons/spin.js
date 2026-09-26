const { randomInt } = require('crypto');
const { EmbedBuilder } = require('discord.js');
const { getGacha, listGrades, listItems } = require('../functions/db');
const { GRADE_COLORS } = require('../functions/ui');
const { UserFacingError } = require('../functions/errors');

module.exports = {
    id: 'spin',
    hasExtraData: true,
    async execute(interaction) {
        const [, rawCount, gachaId] = interaction.customId.split('|');
        const count = Number(rawCount);
        if (![1, 10].includes(count)) throw new Error('Invalid spin count.');

        const gacha = await getGacha(gachaId);
        if (!gacha) throw new UserFacingError('이 가챠는 더 이상 존재하지 않습니다.');
        const grades = await listGrades(gachaId);
        if (!grades.length) throw new UserFacingError('이 가챠에는 등급이 없습니다.');

        let cursor = 1;
        const probabilityTree = [];
        for (const grade of grades) {
            const percentage = Number(grade.percentage);
            probabilityTree.push({ ...grade, start: cursor, end: cursor + percentage - 1, items: await listItems(grade.id) });
            cursor += percentage;
        }

        const results = Array.from({ length: count }, () => {
            const roll = randomInt(1, 101);
            const grade = probabilityTree.find(candidate => roll >= candidate.start && roll <= candidate.end);
            if (!grade) return { blank: true, item: '-', grade: '꽝' };
            if (!grade.items.length) return { item: '-', grade: grade.grade_name, color: grade.color, description: null };
            const item = grade.items[randomInt(grade.items.length)];
            return {
                item: item.item_name,
                grade: grade.grade_name,
                color: grade.color,
                description: item.item_description
            };
        });

        let embed;
        if (count === 1) {
            const result = results[0];
            embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username}님의 결과`, iconURL: interaction.user.displayAvatarURL() })
                .setTitle(result.blank ? '꽝' : `${result.item} (${result.grade})`)
                .setColor(result.blank ? '#FFFFFF' : GRADE_COLORS[result.color]);
            if (result.blank) embed.setDescription('아쉽지만 이번에는 꽝입니다. 다음 행운을 기대해 보세요.');
            else if (result.description) embed.setDescription(result.description);
        } else {
            embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username}님의 결과`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(results.map((result, index) => `${index + 1}. ${result.item} (${result.grade})`).join('\n'))
                .setColor('#FFFFFF');
        }

        await interaction.update({ content: '', embeds: [embed], components: [] });
    }
};

const { randomInt } = require('crypto');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { addGachaPulls, getGacha, listGrades, listItems } = require('../functions/db');
const { BRAND_COLOR, GRADE_COLORS } = require('../functions/ui');
const { UserFacingError } = require('../functions/errors');
const { t } = require('../functions/i18n');

async function getCreator(client, ownerId) {
    const cached = client.users.cache.get(ownerId);
    if (cached) return cached;
    try {
        return await client.users.fetch(ownerId);
    } catch {
        return null;
    }
}

module.exports = {
    feature: 'gacha',
    id: 'spin',
    hasExtraData: true,
    async execute(interaction) {
        const [, rawCount, gachaId] = interaction.customId.split('|');
        const count = Number(rawCount);
        if (![1, 10].includes(count)) throw new Error('Invalid spin count.');

        const gacha = await getGacha(gachaId);
        if (!gacha) throw new UserFacingError('gacha_missing');
        const creatorPromise = getCreator(interaction.client, gacha.owner_id);
        const grades = await listGrades(gachaId);
        if (!grades.length) throw new UserFacingError('gacha_no_grades');

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
            if (!grade) return { blank: true, item: '-', grade: t(interaction, 'blank') };
            if (!grade.items.length) return { item: '-', grade: grade.grade_name, color: grade.color, description: null };
            const item = grade.items[randomInt(grade.items.length)];
            return {
                item: item.item_name,
                grade: grade.grade_name,
                color: grade.color,
                description: item.item_description
            };
        });
        await addGachaPulls(interaction.user.id, count);

        let embed;
        if (count === 1) {
            const result = results[0];
            embed = new EmbedBuilder()
                .setAuthor({ name: t(interaction, 'result_author', { username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL() })
                .setTitle(result.blank ? t(interaction, 'blank') : `${result.item} (${result.grade})`)
                .setColor(result.blank ? BRAND_COLOR : GRADE_COLORS[result.color]);
            if (result.blank) embed.setDescription(t(interaction, 'blank_description'));
            else if (result.description) embed.setDescription(result.description);
        } else {
            embed = new EmbedBuilder()
                .setAuthor({ name: t(interaction, 'result_author', { username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL() })
                .setDescription(results.map((result, index) => `${index + 1}. ${result.item} (${result.grade})`).join('\n'))
                .setColor(BRAND_COLOR);
        }
        const creator = await creatorPromise;
        const creatorName = creator?.username || gacha.owner_id;
        embed.setFooter({
            text: t(interaction, 'gacha_result_footer', { name: gacha.gacha_name, creator: creatorName })
        });

        const rerollRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`spin|1|${gachaId}`)
                .setLabel(t(interaction, 'spin_again_once'))
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`spin|10|${gachaId}`)
                .setLabel(t(interaction, 'spin_again_ten'))
                .setStyle(ButtonStyle.Success)
        );
        await interaction.update({ content: '', embeds: [embed], components: [rerollRow] });
    }
};

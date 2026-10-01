const { EmbedBuilder } = require('discord.js');
const { localeOf, t } = require('./i18n');
const { BRAND_COLOR } = require('./ui');

const RANKS = [
    { minimum: 0, key: 'me_rank_spark' },
    { minimum: 10, key: 'me_rank_explorer' },
    { minimum: 50, key: 'me_rank_navigator' },
    { minimum: 200, key: 'me_rank_pioneer' }
];

function activityScore(stats) {
    return Number(stats.command_uses) + Number(stats.dice_rolls) + Number(stats.gacha_pulls);
}

function rankProgress(source, score) {
    let current = RANKS[0];
    let next = null;
    for (let index = 0; index < RANKS.length; index += 1) {
        if (score >= RANKS[index].minimum) current = RANKS[index];
        else {
            next = RANKS[index];
            break;
        }
    }
    const name = t(source, current.key);
    if (!next) return { name, progress: t(source, 'me_rank_max') };
    return {
        name,
        progress: t(source, 'me_rank_next', {
            count: next.minimum - score,
            rank: t(source, next.key)
        })
    };
}

function formatNumber(source, value) {
    const locale = localeOf(source) === 'en' ? 'en-US' : 'ko-KR';
    return new Intl.NumberFormat(locale).format(Number(value) || 0);
}

function discordDate(timestamp) {
    if (!timestamp) return null;
    return `<t:${Math.floor(Number(timestamp) / 1000)}:D>`;
}

function meView(interaction, stats) {
    const score = activityScore(stats);
    const rank = rankProgress(interaction, score);
    const fortune = stats.last_fortune_score === null
        ? t(interaction, 'me_fortune_none')
        : t(interaction, 'me_fortune_value', {
            count: formatNumber(interaction, stats.fortune_checks),
            score: stats.last_fortune_score,
            date: stats.last_fortune
        });
    const firstSeen = discordDate(stats.first_seen_at_ms) || t(interaction, 'me_started_today');

    return new EmbedBuilder()
        .setAuthor({
            name: t(interaction, 'me_author', { username: interaction.user.username }),
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`## ${rank.name}\n${rank.progress}`)
        .addFields(
            {
                name: t(interaction, 'me_commands'),
                value: t(interaction, 'me_count', { count: formatNumber(interaction, stats.command_uses) }),
                inline: true
            },
            {
                name: t(interaction, 'me_dice'),
                value: t(interaction, 'me_count', { count: formatNumber(interaction, stats.dice_rolls) }),
                inline: true
            },
            {
                name: t(interaction, 'me_pulls'),
                value: t(interaction, 'me_count', { count: formatNumber(interaction, stats.gacha_pulls) }),
                inline: true
            },
            {
                name: t(interaction, 'me_gacha_collection'),
                value: t(interaction, 'me_gacha_value', {
                    gachas: formatNumber(interaction, stats.gacha_count),
                    grades: formatNumber(interaction, stats.grade_count),
                    items: formatNumber(interaction, stats.item_count)
                })
            },
            { name: t(interaction, 'me_fortune'), value: fortune },
            { name: t(interaction, 'me_first_seen'), value: firstSeen, inline: true },
            { name: t(interaction, 'me_activity_score'), value: formatNumber(interaction, score), inline: true }
        )
        .setFooter({ text: t(interaction, 'me_tracking_notice') })
        .setColor(BRAND_COLOR);
}

module.exports = { RANKS, activityScore, meView, rankProgress };

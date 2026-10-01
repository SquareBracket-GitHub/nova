const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { recordDailyFortune } = require('../functions/db');
const { rollDice } = require('../functions/random');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');
const { describe } = require('../locales/commands');

function todayInKorea() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
}

function fortuneMessage(interaction, score) {
    if (score <= 20) return t(interaction, 'fortune_1');
    if (score <= 40) return t(interaction, 'fortune_2');
    if (score <= 60) return t(interaction, 'fortune_3');
    if (score <= 80) return t(interaction, 'fortune_4');
    return t(interaction, 'fortune_5');
}

function checkedAtInKorea(interaction, timestamp) {
    const locale = interaction.novaSettings?.locale === 'en' ? 'en-US' : 'ko-KR';
    return new Intl.DateTimeFormat(locale, {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date(timestamp));
}

module.exports = {
    feature: 'fortune',
    data: describe(new SlashCommandBuilder().setName('fortune'), 'fortune'),

    async execute(interaction) {
        const proposedScore = rollDice(100).total;
        const saved = await recordDailyFortune(interaction.user.id, todayInKorea(), proposedScore, Date.now());
        const score = saved.score;

        const embed = new EmbedBuilder()
            .setAuthor({ name: t(interaction, 'fortune_author', { username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`> ${score}\n\n${fortuneMessage(interaction, score)}`)
            .setColor(BRAND_COLOR);
        if (!saved.created) {
            embed.setFooter({
                text: t(interaction, 'fortune_previous', { time: checkedAtInKorea(interaction, saved.checkedAtMs) })
            });
        }
        await interaction.reply({ embeds: [embed], ephemeral: !saved.created });
    }
};

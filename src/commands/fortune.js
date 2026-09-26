const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { recordDailyFortune } = require('../functions/db');
const { rollDice } = require('../functions/random');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');

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

module.exports = {
    feature: 'fortune',
    data: new SlashCommandBuilder()
        .setName('fortune')
        .setDescription("Reveal today's fortune as a lucky number.")
        .setDescriptionLocalization('ko', '오늘의 운세를 행운의 숫자로 나타냅니다.'),

    async execute(interaction) {
        const score = rollDice(100).total;
        const saved = await recordDailyFortune(interaction.user.id, todayInKorea());
        if (!saved) {
            await interaction.reply({ content: t(interaction, 'fortune_once'), ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: t(interaction, 'fortune_author', { username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`> ${score}\n\n${fortuneMessage(interaction, score)}`)
            .setColor(BRAND_COLOR);
        await interaction.reply({ embeds: [embed] });
    }
};

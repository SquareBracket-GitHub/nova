const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { recordDailyFortune } = require('../functions/db');
const { rollDice } = require('../functions/random');

function todayInKorea() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
}

function fortuneMessage(score) {
    if (score <= 20) return '당신은 충분히 잘하고 있습니다.';
    if (score <= 40) return '오늘은 조금 더 힘을 내도 좋을 것 같습니다.';
    if (score <= 60) return '좋은 하루가 될 것 같군요. 오늘도 응원합니다.';
    if (score <= 80) return '당신의 성공을 기원합니다.';
    return '진심을 다하기에 딱 맞는 하루입니다. 당신을 보여주세요.';
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('운세')
        .setDescription('오늘의 운세를 행운의 숫자로 나타냅니다.'),

    async execute(interaction) {
        const score = rollDice(100).total;
        const saved = await recordDailyFortune(interaction.user.id, todayInKorea());
        if (!saved) {
            await interaction.reply({ content: '운세는 하루에 한 번만 확인할 수 있습니다.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}님의 운세`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`> ${score}\n\n${fortuneMessage(score)}`)
            .setColor('#F8F1C8');
        await interaction.reply({ embeds: [embed] });
    }
};

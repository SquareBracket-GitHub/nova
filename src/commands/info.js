const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getOrCreateUser } = require('../functions/db');
const { BRAND_COLOR } = require('../functions/ui');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('당신의 봇 활용 내역을 확인합니다.'),

    async execute(interaction) {
        const user = await getOrCreateUser(interaction.user.id);
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}님의 정보`, iconURL: interaction.user.displayAvatarURL() })
            .addFields({ name: '마지막 운세 확인일', value: user.last_fortune || '아직 확인하지 않음', inline: true })
            .setColor(BRAND_COLOR);
        await interaction.reply({ embeds: [embed] });
    }
};

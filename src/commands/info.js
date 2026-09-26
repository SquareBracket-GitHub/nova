const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getOrCreateUser } = require('../functions/db');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your bot activity profile.')
        .setDescriptionLocalization('ko', '당신의 봇 활용 내역을 확인합니다.'),

    async execute(interaction) {
        const user = await getOrCreateUser(interaction.user.id);
        const embed = new EmbedBuilder()
            .setAuthor({ name: t(interaction, 'profile_author', { username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL() })
            .addFields({ name: t(interaction, 'last_fortune'), value: user.last_fortune || t(interaction, 'never_checked'), inline: true })
            .setColor(BRAND_COLOR);
        await interaction.reply({ embeds: [embed] });
    }
};

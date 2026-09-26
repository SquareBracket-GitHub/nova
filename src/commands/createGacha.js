const { SlashCommandBuilder } = require('discord.js');
const { createGacha } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    data: new SlashCommandBuilder()
        .setName('gacha-create')
        .setDescription('Create a new gacha.')
        .setDescriptionLocalization('ko', '새 가챠를 만듭니다.')
        .addStringOption(option => option
            .setName('gacha_name')
            .setDescription('Gacha name')
            .setDescriptionLocalization('ko', '가챠 이름')
            .setMinLength(1)
            .setMaxLength(40)
            .setRequired(true)),

    async execute(interaction) {
        await createGacha(interaction.user.id, interaction.options.getString('gacha_name', true).trim());
        await interaction.reply({ content: t(interaction, 'gacha_created'), ephemeral: true });
    }
};

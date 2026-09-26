const { SlashCommandBuilder } = require('discord.js');
const { createGacha } = require('../functions/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gacha-create')
        .setDescription('새 가챠를 만듭니다.')
        .addStringOption(option => option
            .setName('gacha_name')
            .setDescription('가챠 이름')
            .setMinLength(1)
            .setMaxLength(40)
            .setRequired(true)),

    async execute(interaction) {
        await createGacha(interaction.user.id, interaction.options.getString('gacha_name', true).trim());
        await interaction.reply({ content: '가챠를 만들었습니다.', ephemeral: true });
    }
};

const { SlashCommandBuilder } = require('discord.js');
const { createGacha } = require('../functions/db');
const { t } = require('../functions/i18n');
const { describe } = require('../locales/commands');

module.exports = {
    feature: 'gacha',
    data: describe(new SlashCommandBuilder().setName('gacha-create'), 'gachaCreate')
        .addStringOption(option => describe(
            option.setName('gacha_name'), 'gachaCreate', 'gachaName'
        )
            .setMinLength(1)
            .setMaxLength(40)
            .setRequired(true)),

    async execute(interaction) {
        await createGacha(interaction.user.id, interaction.options.getString('gacha_name', true).trim());
        await interaction.reply({ content: t(interaction, 'gacha_created'), ephemeral: true });
    }
};

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../functions/random');
const { addDiceRolls } = require('../functions/db');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');
const { describe } = require('../locales/commands');

module.exports = {
    feature: 'dice',
    data: describe(new SlashCommandBuilder().setName('dice'), 'dice')
        .addIntegerOption(option => describe(option.setName('d'), 'dice', 'd')
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(1_000_000))
        .addIntegerOption(option => describe(option.setName('times'), 'dice', 'times')
            .setMinValue(1)
            .setMaxValue(10))
        .addBooleanOption(option => describe(option.setName('ephemeral'), 'dice', 'ephemeral')),

    async execute(interaction) {
        const sides = interaction.options.getInteger('d', true);
        const count = interaction.options.getInteger('times') || 1;
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;
        const result = rollDice(sides, count);
        await addDiceRolls(interaction.user.id, count);

        const expression = count === 1
            ? `**${result.total}**`
            : `${result.values.map(value => `\`${value}\``).join(' + ')} = **${result.total}**`;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: t(interaction, 'dice_author', { username: interaction.user.username, dice: `${count > 1 ? count : ''}d${sides}` }),
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`>>> ${expression}`)
            .setColor(BRAND_COLOR);

        await interaction.reply({ embeds: [embed], ephemeral });
    }
};

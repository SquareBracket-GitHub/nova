const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../functions/random');
const { addDiceRolls } = require('../functions/db');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');
const { commandText, describe } = require('../locales/commands');

module.exports = {
    feature: 'dice',
    data: describe(new SlashCommandBuilder().setName('special-dice'), 'specialDice')
        .addIntegerOption(option => describe(option.setName('d'), 'specialDice', 'd')
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(1_000_000))
        .addStringOption(option => describe(option.setName('effect'), 'specialDice', 'effect')
            .addChoices(
                { name: commandText('specialDice', 'effectPlus'), value: 'plus' },
                { name: commandText('specialDice', 'effectMinus'), value: 'minus' }
            )
            .setRequired(true))
        .addIntegerOption(option => describe(option.setName('effect-num'), 'specialDice', 'effectNum')
            .setMinValue(1)
            .setMaxValue(1_000_000)
            .setRequired(true))
        .addIntegerOption(option => describe(option.setName('times'), 'specialDice', 'times')
            .setMinValue(1)
            .setMaxValue(10))
        .addBooleanOption(option => describe(option.setName('ephemeral'), 'specialDice', 'ephemeral')),

    async execute(interaction) {
        const sides = interaction.options.getInteger('d', true);
        const count = interaction.options.getInteger('times') || 1;
        const effect = interaction.options.getString('effect', true);
        const effectNumber = interaction.options.getInteger('effect-num', true);
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;
        const modifier = effect === 'plus' ? effectNumber : -effectNumber;
        const result = rollDice(sides, count, modifier);
        await addDiceRolls(interaction.user.id, count);
        const sign = modifier >= 0 ? '+' : '-';
        const base = count === 1
            ? `**${result.total}**`
            : `${result.values.map(value => `\`${value}\``).join(' + ')} = **${result.total}**`;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: t(interaction, 'special_dice_author', {
                    username: interaction.user.username,
                    effect: t(interaction, effect === 'plus' ? 'effect_plus' : 'effect_minus'),
                    dice: `${count > 1 ? count : ''}d${sides}`
                }),
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`>>> ${base} ${sign} ${effectNumber} = **${result.modifiedTotal}**`)
            .setColor(BRAND_COLOR);

        await interaction.reply({ embeds: [embed], ephemeral });
    }
};

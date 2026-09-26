const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../functions/random');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'dice',
    data: new SlashCommandBuilder()
        .setName('special-dice')
        .setDescription('Roll dice with a modifier.')
        .setDescriptionLocalization('ko', '보정값이 적용되는 특수주사위를 굴립니다.')
        .addIntegerOption(option => option
            .setName('d')
            .setDescription('Set the number of sides.')
            .setDescriptionLocalization('ko', '주사위의 최대 눈을 정합니다.')
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(1_000_000))
        .addStringOption(option => option
            .setName('effect')
            .setDescription('Choose whether to add or subtract the modifier.')
            .setDescriptionLocalization('ko', '특수주사위의 효과를 선택합니다.')
            .addChoices(
                { name: 'Plus', name_localizations: { ko: '플러스' }, value: 'plus' },
                { name: 'Minus', name_localizations: { ko: '마이너스' }, value: 'minus' }
            )
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('effect-num')
            .setDescription('Set the modifier value.')
            .setDescriptionLocalization('ko', '더하거나 뺄 값을 정합니다.')
            .setMinValue(1)
            .setMaxValue(1_000_000)
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('times')
            .setDescription('Set how many dice to roll.')
            .setDescriptionLocalization('ko', '주사위를 굴릴 횟수를 정합니다.')
            .setMinValue(1)
            .setMaxValue(10))
        .addBooleanOption(option => option
            .setName('ephemeral')
            .setDescription('Show the result only to you.')
            .setDescriptionLocalization('ko', '결과를 자신에게만 표시합니다.')),

    async execute(interaction) {
        const sides = interaction.options.getInteger('d', true);
        const count = interaction.options.getInteger('times') || 1;
        const effect = interaction.options.getString('effect', true);
        const effectNumber = interaction.options.getInteger('effect-num', true);
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;
        const modifier = effect === 'plus' ? effectNumber : -effectNumber;
        const result = rollDice(sides, count, modifier);
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

        await interaction.reply({ content: t(interaction, 'roll_sound'), embeds: [embed], ephemeral });
    }
};

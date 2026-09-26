const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../functions/random');
const { BRAND_COLOR } = require('../functions/ui');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('특수주사위')
        .setDescription('보정값이 적용되는 특수주사위를 굴립니다.')
        .addIntegerOption(option => option
            .setName('d')
            .setDescription('주사위의 최대 눈을 정합니다.')
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(1_000_000))
        .addStringOption(option => option
            .setName('effect')
            .setDescription('특수주사위의 효과를 선택합니다.')
            .addChoices(
                { name: '플러스', value: 'plus' },
                { name: '마이너스', value: 'minus' }
            )
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('effect-num')
            .setDescription('더하거나 뺄 값을 정합니다.')
            .setMinValue(1)
            .setMaxValue(1_000_000)
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('times')
            .setDescription('주사위를 굴릴 횟수를 정합니다.')
            .setMinValue(1)
            .setMaxValue(10))
        .addBooleanOption(option => option
            .setName('ephemeral')
            .setDescription('결과를 자신에게만 표시합니다.')),

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
                name: `${interaction.user.username}님의 ${effect === 'plus' ? '적색의' : '청색의'} ${count > 1 ? count : ''}d${sides}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`>>> ${base} ${sign} ${effectNumber} = **${result.modifiedTotal}**`)
            .setColor(BRAND_COLOR);

        await interaction.reply({ content: '타라락.', embeds: [embed], ephemeral });
    }
};

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../functions/random');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('주사위')
        .setDescription('주사위를 굴립니다.')
        .addIntegerOption(option => option
            .setName('d')
            .setDescription('주사위의 최대 눈을 정합니다.')
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(1_000_000))
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
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;
        const result = rollDice(sides, count);

        const expression = count === 1
            ? `**${result.total}**`
            : `${result.values.map(value => `\`${value}\``).join(' + ')} = **${result.total}**`;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}님의 ${count > 1 ? count : ''}d${sides}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`>>> ${expression}`)
            .setColor('#F8F1C8');

        await interaction.reply({ content: '타라락.', embeds: [embed], ephemeral });
    }
};

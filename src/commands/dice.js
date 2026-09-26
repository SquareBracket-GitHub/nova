const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../functions/random');
const { BRAND_COLOR } = require('../functions/ui');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'dice',
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Roll dice.')
        .setDescriptionLocalization('ko', '주사위를 굴립니다.')
        .addIntegerOption(option => option
            .setName('d')
            .setDescription('Set the number of sides.')
            .setDescriptionLocalization('ko', '주사위의 최대 눈을 정합니다.')
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(1_000_000))
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
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;
        const result = rollDice(sides, count);

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

        await interaction.reply({ content: t(interaction, 'roll_sound'), embeds: [embed], ephemeral });
    }
};

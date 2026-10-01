const { EmbedBuilder, SlashCommandBuilder, escapeMarkdown } = require('discord.js');
const { UserFacingError } = require('../functions/errors');
const { parseItems, shuffle } = require('../functions/random');
const { t } = require('../functions/i18n');
const { BRAND_COLOR } = require('../functions/ui');
const { describe } = require('../locales/commands');

const MAX_ITEMS = 40;
const MAX_ITEM_LENGTH = 80;

function itemsOption(option, field) {
    return describe(option.setName('items'), 'random', field)
        .setMinLength(1)
        .setMaxLength(2_000)
        .setRequired(true);
}

function privateOption(option) {
    return describe(option.setName('ephemeral'), 'random', 'ephemeral');
}

function readItems(interaction) {
    const items = parseItems(interaction.options.getString('items', true));
    if (items.length < 2) throw new UserFacingError('random_need_items');
    if (items.length > MAX_ITEMS) throw new UserFacingError('random_too_many_items', { maximum: MAX_ITEMS });
    if (items.some(item => item.length > MAX_ITEM_LENGTH)) {
        throw new UserFacingError('random_item_too_long', { maximum: MAX_ITEM_LENGTH });
    }
    return items;
}

function numbered(items) {
    return items.map((item, index) => `${index + 1}. ${escapeMarkdown(item)}`).join('\n');
}

const data = describe(new SlashCommandBuilder().setName('random'), 'random')
    .addSubcommand(command => describe(command.setName('pick'), 'random', 'pick')
        .addStringOption(option => itemsOption(option, 'items'))
        .addBooleanOption(privateOption))
    .addSubcommand(command => describe(command.setName('order'), 'random', 'order')
        .addStringOption(option => itemsOption(option, 'items'))
        .addBooleanOption(privateOption))
    .addSubcommand(command => describe(command.setName('sample'), 'random', 'sample')
        .addStringOption(option => itemsOption(option, 'items'))
        .addIntegerOption(option => describe(option.setName('count'), 'random', 'count')
            .setMinValue(1)
            .setMaxValue(25)
            .setRequired(true))
        .addBooleanOption(privateOption))
    .addSubcommand(command => describe(command.setName('team'), 'random', 'team')
        .addStringOption(option => itemsOption(option, 'items'))
        .addIntegerOption(option => describe(option.setName('teams'), 'random', 'teams')
            .setMinValue(2)
            .setMaxValue(10)
            .setRequired(true))
        .addBooleanOption(privateOption));

module.exports = {
    data,

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const items = readItems(interaction);
        const randomized = shuffle(items);
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;
        const embed = new EmbedBuilder().setColor(BRAND_COLOR);

        if (subcommand === 'pick') {
            embed.setTitle(t(interaction, 'random_pick_title')).setDescription(`> **${escapeMarkdown(randomized[0])}**`);
        } else if (subcommand === 'order') {
            embed.setTitle(t(interaction, 'random_order_title')).setDescription(numbered(randomized));
        } else if (subcommand === 'sample') {
            const count = interaction.options.getInteger('count', true);
            if (count > items.length) throw new UserFacingError('random_sample_too_large', { count: items.length });
            embed.setTitle(t(interaction, 'random_sample_title', { count })).setDescription(numbered(randomized.slice(0, count)));
        } else {
            const teamCount = interaction.options.getInteger('teams', true);
            if (teamCount > items.length) throw new UserFacingError('random_team_too_large', { count: items.length });
            const teams = Array.from({ length: teamCount }, () => []);
            randomized.forEach((item, index) => teams[index % teamCount].push(item));
            embed.setTitle(t(interaction, 'random_team_title')).setDescription(teams
                .map((team, index) => `**${t(interaction, 'random_team_name', { number: index + 1 })}**\n${team.map(item => escapeMarkdown(item)).join('\n')}`)
                .join('\n\n'));
        }

        await interaction.reply({ embeds: [embed], ephemeral });
    }
};

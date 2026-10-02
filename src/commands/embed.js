const { SlashCommandBuilder } = require('discord.js');
const { buildUserEmbed } = require('../functions/embed');
const { describe } = require('../locales/commands');

function stringOption(name, field, maximum) {
    return option => describe(option.setName(name), 'embed', field).setMaxLength(maximum);
}

module.exports = {
    data: describe(new SlashCommandBuilder().setName('embed'), 'embed')
        .addStringOption(stringOption('title', 'title', 256))
        .addStringOption(stringOption('description', 'body', 4_000))
        .addStringOption(stringOption('color', 'color', 7))
        .addStringOption(stringOption('url', 'url', 2_000))
        .addStringOption(stringOption('image', 'image', 2_000))
        .addStringOption(stringOption('thumbnail', 'thumbnail', 2_000))
        .addStringOption(stringOption('author', 'author', 256))
        .addStringOption(stringOption('footer', 'footer', 2_048))
        .addBooleanOption(option => describe(option.setName('timestamp'), 'embed', 'timestamp')),

    async execute(interaction) {
        const value = name => interaction.options.getString(name);
        const embed = buildUserEmbed({
            title: value('title'),
            description: value('description'),
            color: value('color'),
            url: value('url'),
            image: value('image'),
            thumbnail: value('thumbnail'),
            author: value('author'),
            footer: value('footer'),
            timestamp: interaction.options.getBoolean('timestamp') || false
        });
        await interaction.reply({ embeds: [embed] });
    }
};

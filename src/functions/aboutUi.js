const {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder
} = require('discord.js');
const { localeOf } = require('./i18n');
const { BRAND_COLOR } = require('./ui');

const RELEASE_DATE = '2026-10-12';
const ABOUT_COMMANDS = [
    'about',
    'ping',
    'dice',
    'special-dice',
    'fortune',
    'me',
    'gacha-create',
    'gacha-manage',
    'gacha-delete',
    'gacha-import',
    'gacha-export',
    'random',
    'embed',
    'signup',
    'settings'
];

const { aboutCopy } = require('../locales/about');

function formatUptime(milliseconds, locale) {
    let seconds = Math.max(0, Math.floor((milliseconds || 0) / 1000));
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return aboutCopy[locale].uptimeFormat
        .replace('{days}', days)
        .replace('{hours}', hours)
        .replace('{minutes}', minutes)
        .replace('{seconds}', seconds);
}

function navigation(context, page, total, ownerId) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`aboutPage|0|${ownerId}|first`)
            .setLabel(context.first)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === 0),
        new ButtonBuilder()
            .setCustomId(`aboutPage|${Math.max(0, page - 1)}|${ownerId}|previous`)
            .setLabel(context.previous)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
        new ButtonBuilder()
            .setCustomId(`aboutPage|${Math.min(total - 1, page + 1)}|${ownerId}|next`)
            .setLabel(context.next)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === total - 1),
        new ButtonBuilder()
            .setCustomId(`aboutPage|${total - 1}|${ownerId}|last`)
            .setLabel(context.last)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === total - 1)
    );
}

function aboutView(source, client, requestedPage, ownerId) {
    const locale = localeOf(source);
    const context = aboutCopy[locale];
    const total = ABOUT_COMMANDS.length + 2;
    const page = Math.min(Math.max(Number(requestedPage) || 0, 0), total - 1);
    const embed = new EmbedBuilder().setColor(BRAND_COLOR);

    if (page === 0) {
        embed.setTitle(context.introTitle).setDescription(context.intro);
        if (client.user) embed.setThumbnail(client.user.displayAvatarURL());
    } else if (page === total - 1) {
        const ping = Number.isFinite(client.ws?.ping) && client.ws.ping >= 0
            ? `${client.ws.ping} ms`
            : context.unavailable;
        embed
            .setTitle(context.statusTitle)
            .addFields(
                { name: context.releaseDate, value: RELEASE_DATE, inline: true },
                { name: context.uptime, value: formatUptime(client.uptime, locale), inline: true },
                { name: context.ping, value: ping, inline: true }
            );
    } else {
        const commandName = ABOUT_COMMANDS[page - 1];
        const command = context.pages[commandName];
        embed
            .setTitle(`/${commandName}`)
            .addFields(
                { name: context.summaryLabel, value: command.summary },
                { name: context.usageLabel, value: command.usage },
                { name: context.notesLabel, value: command.notes }
            );
    }

    embed.setFooter({ text: `${page + 1} / ${total}` });
    return { embeds: [embed], components: [navigation(context, page, total, ownerId)] };
}

module.exports = { ABOUT_COMMANDS, RELEASE_DATE, aboutView, formatUptime };

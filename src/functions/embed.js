const { EmbedBuilder } = require('discord.js');
const { UserFacingError } = require('./errors');
const { BRAND_COLOR, resolveGradeColor } = require('./ui');

const EMBED_TEXT_LIMIT = 6_000;

function optionalText(value) {
    const text = String(value ?? '').trim();
    return text || null;
}

function httpUrl(value) {
    const text = optionalText(value);
    if (!text) return null;
    try {
        const parsed = new URL(text);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error();
        return parsed.toString();
    } catch {
        throw new UserFacingError('invalid_embed_url');
    }
}

function buildUserEmbed(input = {}) {
    const title = optionalText(input.title);
    const description = optionalText(input.description);
    const author = optionalText(input.author);
    const footer = optionalText(input.footer);
    const url = httpUrl(input.url);
    const image = httpUrl(input.image);
    const thumbnail = httpUrl(input.thumbnail);

    if (url && !title) throw new UserFacingError('embed_url_requires_title');
    if (![title, description, author, footer, image, thumbnail].some(Boolean)) {
        throw new UserFacingError('embed_empty');
    }

    const textLength = [title, description, author, footer]
        .reduce((total, value) => total + (value?.length || 0), 0);
    if (textLength > EMBED_TEXT_LIMIT) throw new UserFacingError('embed_too_long');

    const color = input.color ? resolveGradeColor(input.color) : BRAND_COLOR;
    if (!color) throw new UserFacingError('invalid_color');

    const embed = new EmbedBuilder().setColor(color);
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (url) embed.setURL(url);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (author) embed.setAuthor({ name: author });
    if (footer) embed.setFooter({ text: footer });
    if (input.timestamp) embed.setTimestamp();
    return embed;
}

module.exports = { EMBED_TEXT_LIMIT, buildUserEmbed, httpUrl };

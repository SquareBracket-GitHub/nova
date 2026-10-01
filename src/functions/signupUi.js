const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { t } = require('./i18n');
const { BRAND_COLOR } = require('./ui');

function signupView(source, signup) {
    const count = signup.participants.length;
    const countText = signup.capacity
        ? t(source, 'signup_count_capacity', { count, capacity: signup.capacity })
        : t(source, 'signup_count', { count });
    const status = t(source, signup.closed ? 'signup_status_closed' : 'signup_status_open');
    const participants = count
        ? signup.participants.map(userId => `<@${userId}>`).join('\n')
        : t(source, 'signup_none');

    const embed = new EmbedBuilder()
        .setTitle(signup.title)
        .setColor(BRAND_COLOR)
        .addFields(
            { name: t(source, 'signup_status'), value: `${status} · ${countText}`, inline: true },
            { name: t(source, 'signup_creator'), value: `<@${signup.creatorId}>`, inline: true },
            { name: t(source, 'signup_participants'), value: participants }
        )
        .setTimestamp(signup.createdAtMs);
    if (signup.details) embed.setDescription(signup.details);

    const full = signup.capacity !== null && count >= signup.capacity;
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`signupAction|join|${signup.id}`)
            .setLabel(t(source, 'signup_join'))
            .setStyle(ButtonStyle.Success)
            .setDisabled(signup.closed || full),
        new ButtonBuilder()
            .setCustomId(`signupAction|leave|${signup.id}`)
            .setLabel(t(source, 'signup_leave'))
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(signup.closed),
        new ButtonBuilder()
            .setCustomId(`signupAction|close|${signup.id}`)
            .setLabel(t(source, 'signup_close'))
            .setStyle(ButtonStyle.Danger)
            .setDisabled(signup.closed)
    );

    return { embeds: [embed], components: [row], allowedMentions: { parse: [] } };
}

module.exports = { signupView };

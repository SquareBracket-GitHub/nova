const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { assertSettingsAccess } = require('../functions/settingsAccess');
const { t } = require('../functions/i18n');
const { BRAND_COLOR } = require('../functions/ui');

module.exports = {
    id: 'settingsReset',
    hasExtraData: false,
    async execute(interaction) {
        assertSettingsAccess(interaction);
        const embed = new EmbedBuilder()
            .setTitle(t(interaction, 'settings_title'))
            .setDescription(t(interaction, 'settings_reset_question'))
            .setColor(BRAND_COLOR);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('settingsResetConfirm').setLabel(t(interaction, 'settings_confirm')).setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('settingsResetCancel').setLabel(t(interaction, 'settings_cancel')).setStyle(ButtonStyle.Secondary)
        );
        await interaction.update({ embeds: [embed], components: [row] });
    }
};

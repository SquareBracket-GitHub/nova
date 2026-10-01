const {
    ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listGachasByOwner } = require('../functions/db');
const { t } = require('../functions/i18n');
const { describe } = require('../locales/commands');

module.exports = {
    feature: 'gacha',
    data: describe(new SlashCommandBuilder().setName('gacha-delete'), 'gachaDelete'),

    async execute(interaction) {
        const gachas = await listGachasByOwner(interaction.user.id);
        if (!gachas.length) {
            await interaction.reply({ content: t(interaction, 'no_gachas_delete'), ephemeral: true });
            return;
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('deleteGachaSelect')
            .setPlaceholder(t(interaction, 'choose_gacha_delete_placeholder'))
            .addOptions(gachas.map(gacha => new StringSelectMenuOptionBuilder()
                .setLabel(gacha.gacha_name)
                .setValue(String(gacha.id))));
        await interaction.reply({
            content: t(interaction, 'choose_gacha_delete'),
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

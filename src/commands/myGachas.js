const {
    ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listGachasByOwner } = require('../functions/db');
const { t } = require('../functions/i18n');
const { describe } = require('../locales/commands');

module.exports = {
    feature: 'gacha',
    data: describe(new SlashCommandBuilder().setName('gacha-manage'), 'gachaManage'),

    async execute(interaction) {
        const gachas = await listGachasByOwner(interaction.user.id);
        if (!gachas.length) {
            await interaction.reply({ content: t(interaction, 'no_gachas_create'), ephemeral: true });
            return;
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('selectGacha')
            .setPlaceholder(t(interaction, 'choose_gacha_placeholder'))
            .addOptions(gachas.map(gacha => new StringSelectMenuOptionBuilder()
                .setLabel(gacha.gacha_name)
                .setValue(String(gacha.id))));
        await interaction.reply({
            content: t(interaction, 'choose_gacha'),
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

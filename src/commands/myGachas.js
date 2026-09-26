const {
    ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listGachasByOwner } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    data: new SlashCommandBuilder()
        .setName('gacha-manage')
        .setDescription('View and manage your gachas.')
        .setDescriptionLocalization('ko', '내 가챠 목록을 확인하고 관리합니다.'),

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

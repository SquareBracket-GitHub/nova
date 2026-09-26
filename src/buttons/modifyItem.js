const {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listItems, requireOwnedGrade } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'modifyItem',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await requireOwnedGrade(gradeId, interaction.user.id);
        const items = await listItems(gradeId);
        if (!items.length) {
            await interaction.reply({ content: t(interaction, 'no_items_modify'), ephemeral: true });
            return;
        }
        const select = new StringSelectMenuBuilder()
            .setCustomId(`selectItems|${gradeId}`)
            .setPlaceholder(t(interaction, 'choose_item_modify_placeholder'))
            .addOptions(items.map(item => new StringSelectMenuOptionBuilder()
                .setLabel(item.item_name)
                .setValue(String(item.id))));
        await interaction.reply({
            content: t(interaction, 'choose_item_modify'),
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

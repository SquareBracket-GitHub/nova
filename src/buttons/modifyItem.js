const {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listItems, requireOwnedGrade } = require('../functions/db');

module.exports = {
    id: 'modifyItem',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await requireOwnedGrade(gradeId, interaction.user.id);
        const items = await listItems(gradeId);
        if (!items.length) {
            await interaction.reply({ content: '수정할 아이템이 없습니다.', ephemeral: true });
            return;
        }
        const select = new StringSelectMenuBuilder()
            .setCustomId(`selectItems|${gradeId}`)
            .setPlaceholder('수정할 아이템을 선택하세요.')
            .addOptions(items.map(item => new StringSelectMenuOptionBuilder()
                .setLabel(item.item_name)
                .setValue(String(item.id))));
        await interaction.reply({
            content: '수정할 아이템을 선택하세요.',
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

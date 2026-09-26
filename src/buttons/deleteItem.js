const {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listItems, requireOwnedGrade } = require('../functions/db');

module.exports = {
    id: 'deleteItem',
    hasExtraData: true,
    async execute(interaction) {
        const gradeId = interaction.customId.split('|')[1];
        await requireOwnedGrade(gradeId, interaction.user.id);
        const items = await listItems(gradeId);
        if (!items.length) {
            await interaction.reply({ content: '삭제할 아이템이 없습니다.', ephemeral: true });
            return;
        }
        const select = new StringSelectMenuBuilder()
            .setCustomId(`deleteItemSelect|${gradeId}`)
            .setPlaceholder('삭제할 아이템을 선택하세요.')
            .addOptions(items.map(item => new StringSelectMenuOptionBuilder()
                .setLabel(item.item_name)
                .setValue(String(item.id))));
        await interaction.reply({
            content: '삭제할 아이템을 선택하세요. 이 작업은 되돌릴 수 없습니다.',
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

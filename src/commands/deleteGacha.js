const {
    ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listGachasByOwner } = require('../functions/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_gacha')
        .setDescription('내 가챠를 삭제합니다.'),

    async execute(interaction) {
        const gachas = await listGachasByOwner(interaction.user.id);
        if (!gachas.length) {
            await interaction.reply({ content: '삭제할 가챠가 없습니다.', ephemeral: true });
            return;
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('deleteGachaSelect')
            .setPlaceholder('삭제할 가챠를 선택하세요.')
            .addOptions(gachas.map(gacha => new StringSelectMenuOptionBuilder()
                .setLabel(gacha.gacha_name)
                .setValue(String(gacha.id))));
        await interaction.reply({
            content: '삭제할 가챠를 선택하세요. 이 작업은 되돌릴 수 없습니다.',
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

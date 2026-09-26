const {
    ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require('discord.js');
const { listGachasByOwner } = require('../functions/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my_gachas')
        .setDescription('내 가챠 목록을 확인하고 관리합니다.'),

    async execute(interaction) {
        const gachas = await listGachasByOwner(interaction.user.id);
        if (!gachas.length) {
            await interaction.reply({ content: '아직 가챠가 없습니다. `/create_gacha`로 만들어 보세요.', ephemeral: true });
            return;
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('selectGacha')
            .setPlaceholder('확인할 가챠를 선택하세요.')
            .addOptions(gachas.map(gacha => new StringSelectMenuOptionBuilder()
                .setLabel(gacha.gacha_name)
                .setValue(String(gacha.id))));
        await interaction.reply({
            content: '자세히 확인할 가챠를 선택하세요.',
            components: [new ActionRowBuilder().addComponents(select)],
            ephemeral: true
        });
    }
};

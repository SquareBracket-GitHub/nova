const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { getOwnedGachaDefinition, listGachasByOwner } = require('../functions/db');
const { exportGachaCsv, exportGachaJson, safeFileStem } = require('../functions/gachaExport');
const { t } = require('../functions/i18n');
const { describe } = require('../locales/commands');

module.exports = {
    feature: 'gacha',
    data: describe(new SlashCommandBuilder().setName('gacha-export'), 'gachaExport')
        .addStringOption(option => describe(option.setName('gacha'), 'gachaExport', 'gacha')
            .setAutocomplete(true)
            .setRequired(true))
        .addStringOption(option => describe(option.setName('format'), 'gachaExport', 'format')
            .addChoices(
                { name: 'JSON', value: 'json' },
                { name: 'CSV', value: 'csv' }
            )),

    async autocomplete(interaction) {
        const query = interaction.options.getFocused().trim().toLocaleLowerCase();
        const gachas = await listGachasByOwner(interaction.user.id);
        await interaction.respond(gachas
            .filter(gacha => gacha.gacha_name.toLocaleLowerCase().includes(query))
            .slice(0, 25)
            .map(gacha => ({ name: gacha.gacha_name, value: String(gacha.id) })));
    },

    async execute(interaction) {
        const gachaId = interaction.options.getString('gacha', true);
        const format = interaction.options.getString('format') || 'json';
        const definition = await getOwnedGachaDefinition(gachaId, interaction.user.id);
        const body = format === 'csv'
            ? `\uFEFF${exportGachaCsv(definition)}`
            : exportGachaJson(definition);
        const filename = `${safeFileStem(definition.name)}.${format}`;
        const attachment = new AttachmentBuilder(Buffer.from(body, 'utf8'), { name: filename });
        await interaction.reply({
            content: t(interaction, 'gacha_exported', { name: definition.name, format: format.toUpperCase() }),
            files: [attachment],
            ephemeral: true
        });
    }
};

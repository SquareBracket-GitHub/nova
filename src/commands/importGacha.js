const { SlashCommandBuilder } = require('discord.js');
const { importGacha } = require('../functions/db');
const { ImportValidationError, parseGachaImport } = require('../functions/gachaImport');
const { UserFacingError } = require('../functions/errors');
const { t } = require('../functions/i18n');
const { describe, localizeName } = require('../locales/commands');

const MAX_IMPORT_BYTES = 256 * 1024;

module.exports = {
    feature: 'gacha',
    data: describe(new SlashCommandBuilder().setName('gacha-import'), 'gachaImport')
        .addAttachmentOption(option => describe(
            localizeName(option, 'gachaImport', 'fileName'), 'gachaImport', 'fileDescription'
        )
            .setRequired(true)),

    async execute(interaction) {
        const attachment = interaction.options.getAttachment('file', true);
        if (attachment.size > MAX_IMPORT_BYTES) throw new UserFacingError('gacha_import_too_large');

        await interaction.deferReply({ ephemeral: true });
        try {
            const response = await fetch(attachment.url);
            if (!response.ok) throw new UserFacingError('gacha_import_download_failed');
            const text = await response.text();
            const definition = parseGachaImport(attachment.name, text);
            await importGacha(interaction.user.id, definition);
            const itemCount = definition.grades.reduce((sum, grade) => sum + grade.items.length, 0);
            await interaction.editReply({
                content: t(interaction, 'gacha_imported', {
                    name: definition.name,
                    grades: definition.grades.length,
                    items: itemCount
                })
            });
        } catch (error) {
            if (error instanceof ImportValidationError) {
                await interaction.editReply({ content: t(interaction, 'gacha_import_invalid', { reason: error.message }) });
                return;
            }
            if (error instanceof UserFacingError) {
                await interaction.editReply({ content: t(interaction, error.translationKey, error.variables) });
                return;
            }
            console.error(error);
            await interaction.editReply({ content: t(interaction, 'generic_error') });
        }
    }
};

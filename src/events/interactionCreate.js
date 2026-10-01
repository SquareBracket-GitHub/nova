const fs = require('fs');
const path = require('path');
const { Events, MessageFlags } = require("discord.js");
const { getGuildSettings, recordCommandUse } = require('../functions/db');
const { t } = require('../functions/i18n');

function loadHandlers(directory) {
    const absoluteDirectory = path.join(__dirname, '..', directory);
    if (!fs.existsSync(absoluteDirectory)) return [];

    return fs.readdirSync(absoluteDirectory)
        .filter(file => file.endsWith('.js'))
        .map(file => require(path.join(absoluteDirectory, file)));
}

const commands = loadHandlers('commands');
const buttons = loadHandlers('buttons');
const selects = loadHandlers('selects');
const modals = loadHandlers('modals');

function findComponent(handlers, customId) {
    const baseId = customId.split('|')[0];
    return handlers.find(handler => handler.id === customId || (handler.hasExtraData && handler.id === baseId));
}

async function reportError(interaction, error) {
    console.error(error);
    const variables = { ...error.variables };
    if (variables.labelKey) variables.label = t(interaction, variables.labelKey);
    const content = error.translationKey
        ? t(interaction, error.translationKey, variables)
        : t(interaction, 'generic_error');
    const response = { content, flags: MessageFlags.Ephemeral };

    if (interaction.deferred || interaction.replied) await interaction.followUp(response);
    else await interaction.reply(response);
}

module.exports = {
    event: Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {
        try {
            if (interaction.isAutocomplete()) {
                const handler = commands.find(command => command.data.name === interaction.commandName);
                if (handler?.autocomplete) await handler.autocomplete(interaction);
                else await interaction.respond([]);
                return;
            }

            let handler;

            if (interaction.isChatInputCommand()) {
                handler = commands.find(command => command.data.name === interaction.commandName);
            } else if (interaction.isButton()) {
                handler = findComponent(buttons, interaction.customId);
            } else if (interaction.isStringSelectMenu()) {
                handler = findComponent(selects, interaction.customId);
            } else if (interaction.isModalSubmit()) {
                handler = findComponent(modals, interaction.customId);
            }

            if (!handler) return;

            interaction.novaSettings = await getGuildSettings(interaction.guildId);
            if (handler.feature && !interaction.novaSettings.features[handler.feature]) {
                await interaction.reply({ content: t(interaction, 'feature_disabled'), flags: MessageFlags.Ephemeral });
                return;
            }

            if (interaction.isChatInputCommand()) {
                await recordCommandUse(interaction.user.id, Date.now());
            }

            await handler.execute(interaction, client);
        } catch (error) {
            await reportError(interaction, error);
        }
    }
}

const fs = require('fs');
const path = require('path');
const { Events } = require("discord.js");

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
    const content = error.userMessage || '요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    const response = { content, ephemeral: true };

    if (interaction.deferred || interaction.replied) await interaction.followUp(response);
    else await interaction.reply(response);
}

module.exports = {
    event: Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {
        try {
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

            if (handler) await handler.execute(interaction, client);
        } catch (error) {
            await reportError(interaction, error);
        }
    }
}

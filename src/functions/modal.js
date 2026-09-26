const { ActionRowBuilder, ModalBuilder } = require('discord.js');

function createModal(customId, title, inputs) {
    const modal = new ModalBuilder().setCustomId(customId).setTitle(title);
    modal.addComponents(inputs.map(input => new ActionRowBuilder().addComponents(input)));
    return modal;
}

module.exports = { createModal };

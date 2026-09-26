const { Events } = require("discord.js");

module.exports = {
    event: Events.ClientReady, /* This object exports an event listener for the Discord.js 'ClientReady' event. */
    once: true, /* The 'once' property is set to true, indicating that the event listener should only be executed once. */
    async execute() {
        console.log('ready');
    }
}
const { ActivityType, Events } = require("discord.js");

const ABOUT_ACTIVITY = Object.freeze({
    activities: [{ name: '/about', type: ActivityType.Playing }],
    status: 'online'
});

module.exports = {
    event: Events.ClientReady, /* This object exports an event listener for the Discord.js 'ClientReady' event. */
    once: true, /* The 'once' property is set to true, indicating that the event listener should only be executed once. */
    async execute(client) {
        client.user.setPresence(ABOUT_ACTIVITY);
        console.log('ready');
    },
    ABOUT_ACTIVITY
};

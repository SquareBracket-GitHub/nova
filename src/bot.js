const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { getBotConfig } = require('./functions/config');
const { closePool } = require('./functions/db');

const config = getBotConfig();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const eventFolders = fs.readdirSync(`${__dirname}/events`).filter((file) => file.endsWith(".js"));
eventFolders.forEach(file => {
    const event = require(`./events/${file}`);
    const listener = (...args) => {
        Promise.resolve(event.execute(...args, client)).catch(error => console.error(`Event failed: ${event.event}`, error));
    };
    if (event.once) {
        client.once(event.event, listener);
    } else if (!event.once) {
        client.on(event.event, listener);
    }
});

let shuttingDown = false;
async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}; shutting down ${config.environment} bot.`);
    client.destroy();
    await closePool();
}

process.once('SIGINT', () => shutdown('SIGINT').catch(console.error));
process.once('SIGTERM', () => shutdown('SIGTERM').catch(console.error));

client.login(config.token);

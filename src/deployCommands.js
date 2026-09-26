const { REST, Routes } = require('discord.js');
const fs = require("fs");
const path = require('path');
const { getBotConfig } = require('./functions/config');

const config = getBotConfig();

let commands = [];

const commandsFiles = fs
  .readdirSync(path.join(__dirname, 'commands'))
  .filter((file) => file.endsWith(".js"));

commandsFiles.forEach(file => {
  const command = require(`./commands/${file}`);

  commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    if (config.commandMode === 'GLOBAL') {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

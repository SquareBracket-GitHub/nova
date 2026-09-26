const { PermissionFlagsBits } = require('discord.js');
const { UserFacingError } = require('./errors');

function assertSettingsAccess(interaction) {
    if (!interaction.guildId) throw new UserFacingError('settings_guild_only');
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        throw new UserFacingError('settings_permission');
    }
}

module.exports = { assertSettingsAccess };

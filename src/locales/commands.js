const { commands: en } = require('./en');

function commandText(command, field = 'description') {
    return en[command][field];
}

function describe(builder, command, field = 'description') {
    return builder.setDescription(commandText(command, field));
}

function localizeName(builder, command, field) {
    return builder.setName(commandText(command, field));
}

module.exports = { commandText, describe, localizeName };

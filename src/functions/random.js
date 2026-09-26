const { randomInt } = require('crypto');

function rollDice(sides, count = 1, modifier = 0) {
    const values = Array.from({ length: count }, () => randomInt(1, sides + 1));
    const total = values.reduce((sum, value) => sum + value, 0);
    return { values, total, modifiedTotal: total + modifier };
}

module.exports = { rollDice };

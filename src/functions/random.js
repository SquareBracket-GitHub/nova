const { randomInt } = require('crypto');

function rollDice(sides, count = 1, modifier = 0) {
    const values = Array.from({ length: count }, () => randomInt(1, sides + 1));
    const total = values.reduce((sum, value) => sum + value, 0);
    return { values, total, modifiedTotal: total + modifier };
}

function randomIndex(maximum) {
    return randomInt(0, maximum);
}

function shuffle(values, pickIndex = randomIndex) {
    const shuffled = [...values];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const selected = pickIndex(index + 1);
        [shuffled[index], shuffled[selected]] = [shuffled[selected], shuffled[index]];
    }
    return shuffled;
}

function parseItems(input) {
    return input
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(Boolean);
}

module.exports = { parseItems, rollDice, shuffle };

const assert = require('node:assert/strict');
const test = require('node:test');
const { parseItems, rollDice, shuffle } = require('../src/functions/random');

test('rollDice keeps every value inside the requested range', () => {
    for (let iteration = 0; iteration < 1_000; iteration += 1) {
        const result = rollDice(1_000, 10, 7);
        assert.equal(result.values.length, 10);
        assert.ok(result.values.every(value => value >= 1 && value <= 1_000));
        assert.equal(result.total, result.values.reduce((sum, value) => sum + value, 0));
        assert.equal(result.modifiedTotal, result.total + 7);
    }
});

test('rollDice supports dice larger than one byte', () => {
    const observed = new Set();
    for (let iteration = 0; iteration < 2_000; iteration += 1) {
        observed.add(rollDice(1_000).total);
    }
    assert.ok([...observed].some(value => value > 256));
});

test('parseItems accepts comma and new-line separated lists', () => {
    assert.deepEqual(parseItems('apple, banana\ncarrot\n\n'), ['apple', 'banana', 'carrot']);
});

test('shuffle returns a new array with every original item', () => {
    const source = ['A', 'B', 'C', 'D'];
    const result = shuffle(source, () => 0);
    assert.deepEqual(source, ['A', 'B', 'C', 'D']);
    assert.deepEqual([...result].sort(), [...source].sort());
    assert.notDeepEqual(result, source);
});

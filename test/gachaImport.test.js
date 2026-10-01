const assert = require('node:assert/strict');
const test = require('node:test');
const { ImportValidationError, parseGachaImport } = require('../src/functions/gachaImport');

test('parses a JSON gacha definition', () => {
    const result = parseGachaImport('sample.json', JSON.stringify({
        name: 'Treasure',
        grades: [{ name: 'Rare', percentage: 10, color: 'purple', items: ['Gem', { name: 'Crown', description: 'Shiny' }] }]
    }));
    assert.equal(result.name, 'Treasure');
    assert.equal(result.grades[0].items[1].description, 'Shiny');
});

test('parses quoted CSV fields and groups grades', () => {
    const csv = [
        'gacha_name,grade_name,percentage,color,item_name,item_description',
        'Lunch,Rare,20,purple,Pizza,"Cheese, tomato"',
        'Lunch,Common,80,gray,Salad,',
        'Lunch,Common,80,gray,Soup,"Hot\nand tasty"'
    ].join('\n');
    const result = parseGachaImport('sample.csv', csv);
    assert.equal(result.grades.length, 2);
    assert.equal(result.grades[1].items[1].description, 'Hot\nand tasty');
});

test('rejects imports whose probability exceeds 100 percent', () => {
    assert.throws(() => parseGachaImport('sample.json', JSON.stringify({
        name: 'Broken',
        grades: [
            { name: 'A', percentage: 60, color: 'blue', items: [] },
            { name: 'B', percentage: 50, color: 'gray', items: [] }
        ]
    })), ImportValidationError);
});

const assert = require('node:assert/strict');
const test = require('node:test');
const { exportGachaCsv, exportGachaJson, safeFileStem } = require('../src/functions/gachaExport');
const { parseGachaImport } = require('../src/functions/gachaImport');

const definition = {
    name: 'Lunch / Dinner',
    grades: [
        {
            name: 'Rare', percentage: 20, color: 'purple',
            items: [{ name: 'Pizza', description: 'Cheese, tomato' }]
        },
        { name: 'Empty', percentage: 10, color: 'gray', items: [] }
    ]
};

test('JSON export can be imported again', () => {
    assert.deepEqual(parseGachaImport('gacha.json', exportGachaJson(definition)), definition);
});

test('CSV export quotes fields and preserves grades without items', () => {
    const csv = exportGachaCsv(definition);
    assert.match(csv, /"Cheese, tomato"/);
    assert.deepEqual(parseGachaImport('gacha.csv', csv), definition);
});

test('export filename removes characters that are invalid on common filesystems', () => {
    assert.equal(safeFileStem('Lunch / Dinner:*?'), 'Lunch _ Dinner___');
});

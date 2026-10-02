const assert = require('node:assert/strict');
const test = require('node:test');
const { normalizeGradeColor, resolveGradeColor } = require('../src/functions/colors');

test('normalizes preset grade colors', () => {
    assert.equal(normalizeGradeColor(' Purple '), 'purple');
    assert.equal(resolveGradeColor('purple'), '#BA55D3');
});

test('accepts six-digit hex grade colors with an optional hash', () => {
    assert.equal(normalizeGradeColor('#ffb347'), '#FFB347');
    assert.equal(normalizeGradeColor('005aff'), '#005AFF');
    assert.equal(resolveGradeColor('005aff'), '#005AFF');
});

test('rejects malformed hex grade colors', () => {
    assert.equal(normalizeGradeColor('#fff'), null);
    assert.equal(normalizeGradeColor('#GG0000'), null);
    assert.equal(normalizeGradeColor('red'), null);
});

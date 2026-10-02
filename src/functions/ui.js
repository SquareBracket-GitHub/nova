const BRAND_COLOR = '#FFFFFF';
const { GRADE_COLORS, resolveGradeColor } = require('./colors');

function truncate(value, maximum = 1024) {
    if (value.length <= maximum) return value;
    return `${value.slice(0, maximum - 1)}…`;
}

module.exports = { BRAND_COLOR, GRADE_COLORS, resolveGradeColor, truncate };

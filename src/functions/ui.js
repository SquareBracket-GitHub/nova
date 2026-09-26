const BRAND_COLOR = '#FFFFFF';

const GRADE_COLORS = {
    gray: '#8F9498',
    green: '#47653A',
    blue: '#005AFF',
    purple: '#BA55D3',
    yellow: '#FFE84B'
};

function truncate(value, maximum = 1024) {
    if (value.length <= maximum) return value;
    return `${value.slice(0, maximum - 1)}…`;
}

module.exports = { BRAND_COLOR, GRADE_COLORS, truncate };

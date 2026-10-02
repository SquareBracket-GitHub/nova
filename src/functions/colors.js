const GRADE_COLORS = Object.freeze({
    gray: '#8F9498',
    green: '#47653A',
    blue: '#005AFF',
    purple: '#BA55D3',
    yellow: '#FFE84B'
});

function normalizeGradeColor(value) {
    const color = String(value ?? '').trim().toLowerCase();
    if (Object.hasOwn(GRADE_COLORS, color)) return color;

    const hex = /^#?([0-9a-f]{6})$/.exec(color);
    return hex ? `#${hex[1].toUpperCase()}` : null;
}

function resolveGradeColor(value) {
    const color = normalizeGradeColor(value);
    if (!color) return null;
    return GRADE_COLORS[color] || color;
}

module.exports = { GRADE_COLORS, normalizeGradeColor, resolveGradeColor };

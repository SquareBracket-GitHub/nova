function csvCell(value) {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function exportGachaJson(definition) {
    return `${JSON.stringify(definition, null, 2)}\n`;
}

function exportGachaCsv(definition) {
    const rows = [['gacha_name', 'grade_name', 'percentage', 'color', 'item_name', 'item_description']];
    for (const grade of definition.grades) {
        if (!grade.items.length) {
            rows.push([definition.name, grade.name, grade.percentage, grade.color, '', '']);
            continue;
        }
        for (const item of grade.items) {
            rows.push([
                definition.name,
                grade.name,
                grade.percentage,
                grade.color,
                item.name,
                item.description
            ]);
        }
    }
    return `${rows.map(row => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}

function safeFileStem(name) {
    const stem = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim();
    return (stem || 'gacha').slice(0, 80);
}

module.exports = { exportGachaCsv, exportGachaJson, safeFileStem };

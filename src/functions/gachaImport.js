const { normalizeGradeColor } = require('./colors');

class ImportValidationError extends Error {}

function requiredText(value, label, maximum) {
    const text = String(value ?? '').trim();
    if (!text) throw new ImportValidationError(`${label} is required.`);
    if (text.length > maximum) throw new ImportValidationError(`${label} must be ${maximum} characters or fewer.`);
    return text;
}

function optionalText(value, label, maximum) {
    const text = String(value ?? '').trim();
    if (text.length > maximum) throw new ImportValidationError(`${label} must be ${maximum} characters or fewer.`);
    return text || null;
}

function normalizeDefinition(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new ImportValidationError('The JSON root must be an object.');
    }

    const name = requiredText(input.name ?? input.gacha_name, 'Gacha name', 40);
    if (!Array.isArray(input.grades) || !input.grades.length) {
        throw new ImportValidationError('At least one grade is required.');
    }
    if (input.grades.length > 25) throw new ImportValidationError('A gacha can contain up to 25 grades.');

    const gradeNames = new Set();
    let totalPercentage = 0;
    const grades = input.grades.map((rawGrade, gradeIndex) => {
        const label = `Grade ${gradeIndex + 1}`;
        const gradeName = requiredText(rawGrade?.name ?? rawGrade?.grade_name, `${label} name`, 40);
        const normalizedGradeName = gradeName.toLocaleLowerCase();
        if (gradeNames.has(normalizedGradeName)) throw new ImportValidationError(`Duplicate grade: ${gradeName}`);
        gradeNames.add(normalizedGradeName);

        const percentage = Number(rawGrade?.percentage);
        if (!Number.isInteger(percentage) || percentage < 1 || percentage > 100) {
            throw new ImportValidationError(`${label} percentage must be an integer from 1 to 100.`);
        }
        totalPercentage += percentage;
        const color = normalizeGradeColor(rawGrade?.color);
        if (!color) throw new ImportValidationError(`${label} has an invalid color.`);

        const rawItems = rawGrade?.items ?? [];
        if (!Array.isArray(rawItems)) throw new ImportValidationError(`${label} items must be an array.`);
        if (rawItems.length > 25) throw new ImportValidationError(`${label} can contain up to 25 items.`);
        const itemNames = new Set();
        const items = rawItems.map((rawItem, itemIndex) => {
            const item = typeof rawItem === 'string' ? { name: rawItem } : rawItem;
            const itemName = requiredText(item?.name ?? item?.item_name, `${label} item ${itemIndex + 1} name`, 40);
            const normalizedItemName = itemName.toLocaleLowerCase();
            if (itemNames.has(normalizedItemName)) throw new ImportValidationError(`Duplicate item in ${gradeName}: ${itemName}`);
            itemNames.add(normalizedItemName);
            return {
                name: itemName,
                description: optionalText(item?.description ?? item?.item_description, `${itemName} description`, 150)
            };
        });
        return { name: gradeName, percentage, color, items };
    });

    if (totalPercentage > 100) throw new ImportValidationError('The combined grade probability cannot exceed 100%.');
    return { name, grades };
}

function parseCsvRows(text) {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;
    const source = text.replace(/^\uFEFF/, '');

    for (let index = 0; index < source.length; index += 1) {
        const character = source[index];
        if (quoted) {
            if (character === '"' && source[index + 1] === '"') {
                field += '"';
                index += 1;
            } else if (character === '"') {
                quoted = false;
            } else {
                field += character;
            }
        } else if (character === '"') {
            if (field) throw new ImportValidationError('CSV contains an unexpected quote.');
            quoted = true;
        } else if (character === ',') {
            row.push(field);
            field = '';
        } else if (character === '\n') {
            row.push(field.replace(/\r$/, ''));
            if (row.some(value => value.trim())) rows.push(row);
            row = [];
            field = '';
        } else {
            field += character;
        }
    }
    if (quoted) throw new ImportValidationError('CSV contains an unclosed quote.');
    row.push(field.replace(/\r$/, ''));
    if (row.some(value => value.trim())) rows.push(row);
    return rows;
}

function parseCsv(text) {
    const rows = parseCsvRows(text);
    if (rows.length < 2) throw new ImportValidationError('CSV must contain a header and at least one data row.');
    const headers = rows[0].map(header => header.trim().toLowerCase());
    const required = ['gacha_name', 'grade_name', 'percentage', 'color', 'item_name', 'item_description'];
    for (const header of required) {
        if (!headers.includes(header)) throw new ImportValidationError(`CSV is missing the ${header} column.`);
    }

    const records = rows.slice(1).map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
    const gachaNames = new Set(records.map(record => record.gacha_name.trim()).filter(Boolean));
    if (gachaNames.size !== 1) throw new ImportValidationError('Every CSV row must use the same gacha_name.');

    const gradeMap = new Map();
    for (const record of records) {
        const key = record.grade_name.trim().toLocaleLowerCase();
        if (!key) throw new ImportValidationError('Every CSV row must include grade_name.');
        const percentage = record.percentage.trim();
        const color = normalizeGradeColor(record.color);
        if (!color) throw new ImportValidationError(`Grade ${record.grade_name.trim()} has an invalid color.`);
        const existing = gradeMap.get(key);
        if (existing && (existing.percentage !== percentage || existing.color !== color)) {
            throw new ImportValidationError(`Grade settings are inconsistent: ${record.grade_name.trim()}`);
        }
        const grade = existing || {
            name: record.grade_name,
            percentage,
            color,
            items: []
        };
        if (record.item_name.trim()) {
            grade.items.push({ name: record.item_name, description: record.item_description });
        } else if (record.item_description.trim()) {
            throw new ImportValidationError('item_description cannot be used without item_name.');
        }
        gradeMap.set(key, grade);
    }

    return normalizeDefinition({ name: [...gachaNames][0], grades: [...gradeMap.values()] });
}

function parseGachaImport(filename, text) {
    const extension = String(filename).toLowerCase().split('.').pop();
    if (extension === 'json') {
        let value;
        try {
            value = JSON.parse(text.replace(/^\uFEFF/, ''));
        } catch {
            throw new ImportValidationError('The JSON file is not valid.');
        }
        return normalizeDefinition(value);
    }
    if (extension === 'csv') return parseCsv(text);
    throw new ImportValidationError('Only .json and .csv files are supported.');
}

module.exports = { ImportValidationError, normalizeDefinition, parseCsvRows, parseGachaImport };

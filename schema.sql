CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(32) PRIMARY KEY,
    last_fortune DATE NULL
);

CREATE TABLE IF NOT EXISTS gachas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id VARCHAR(32) NOT NULL,
    gacha_name VARCHAR(40) NOT NULL,
    UNIQUE KEY uq_gacha_owner_name (owner_id, gacha_name),
    KEY idx_gacha_owner (owner_id)
);

CREATE TABLE IF NOT EXISTS grades (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    gacha_id BIGINT UNSIGNED NOT NULL,
    grade_name VARCHAR(40) NOT NULL,
    percentage TINYINT UNSIGNED NOT NULL,
    color ENUM('gray', 'green', 'blue', 'purple', 'yellow') NOT NULL,
    UNIQUE KEY uq_grade_gacha_name (gacha_id, grade_name),
    CONSTRAINT fk_grade_gacha FOREIGN KEY (gacha_id) REFERENCES gachas(id) ON DELETE CASCADE,
    CONSTRAINT chk_grade_percentage CHECK (percentage BETWEEN 1 AND 100)
);

CREATE TABLE IF NOT EXISTS items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    grade_id BIGINT UNSIGNED NOT NULL,
    item_name VARCHAR(40) NOT NULL,
    item_description VARCHAR(150) NULL,
    UNIQUE KEY uq_item_grade_name (grade_id, item_name),
    CONSTRAINT fk_item_grade FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE
);

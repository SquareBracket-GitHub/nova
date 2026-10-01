ALTER TABLE users
    ADD COLUMN last_fortune_score TINYINT UNSIGNED NULL AFTER last_fortune,
    ADD COLUMN last_fortune_checked_at_ms BIGINT UNSIGNED NULL AFTER last_fortune_score;

ALTER TABLE users
    ADD COLUMN first_seen_at_ms BIGINT UNSIGNED NULL AFTER last_fortune_checked_at_ms,
    ADD COLUMN last_active_at_ms BIGINT UNSIGNED NULL AFTER first_seen_at_ms,
    ADD COLUMN command_uses BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER last_active_at_ms,
    ADD COLUMN dice_rolls BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER command_uses,
    ADD COLUMN gacha_pulls BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER dice_rolls,
    ADD COLUMN fortune_checks BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER gacha_pulls;

UPDATE users
SET first_seen_at_ms = last_fortune_checked_at_ms,
    last_active_at_ms = last_fortune_checked_at_ms,
    fortune_checks = CASE WHEN last_fortune IS NULL THEN 0 ELSE 1 END
WHERE last_fortune IS NOT NULL;

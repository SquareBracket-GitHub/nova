CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id VARCHAR(32) PRIMARY KEY,
    locale VARCHAR(10) NOT NULL DEFAULT 'ko',
    updated_by VARCHAR(32) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_guild_locale CHECK (locale IN ('ko', 'en'))
);

CREATE TABLE IF NOT EXISTS guild_features (
    guild_id VARCHAR(32) NOT NULL,
    feature_key VARCHAR(32) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by VARCHAR(32) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (guild_id, feature_key),
    CONSTRAINT fk_feature_guild FOREIGN KEY (guild_id) REFERENCES guild_settings(guild_id) ON DELETE CASCADE,
    CONSTRAINT chk_feature_key CHECK (feature_key IN ('dice', 'fortune', 'gacha', 'emoji'))
);

CREATE TABLE IF NOT EXISTS guild_settings_audit (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    guild_id VARCHAR(32) NOT NULL,
    actor_id VARCHAR(32) NOT NULL,
    action VARCHAR(32) NOT NULL,
    details JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_settings_audit_guild_created (guild_id, created_at)
);

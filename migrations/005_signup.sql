CREATE TABLE signup_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    creator_id VARCHAR(32) NOT NULL,
    guild_id VARCHAR(32) NOT NULL,
    channel_id VARCHAR(32) NOT NULL,
    title VARCHAR(100) NOT NULL,
    details VARCHAR(1000) NULL,
    capacity TINYINT UNSIGNED NULL,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at_ms BIGINT UNSIGNED NOT NULL,
    KEY idx_signup_creator (creator_id),
    KEY idx_signup_guild (guild_id)
);

CREATE TABLE signup_participants (
    event_id BIGINT UNSIGNED NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    joined_at_ms BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (event_id, user_id),
    KEY idx_signup_participant_user (user_id),
    CONSTRAINT fk_signup_participant_event
        FOREIGN KEY (event_id) REFERENCES signup_events(id) ON DELETE CASCADE
);

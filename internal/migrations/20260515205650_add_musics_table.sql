-- +goose Up
CREATE TABLE musics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_publisher UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    explicit BOOLEAN DEFAULT false,
    plays_count INT DEFAULT 0,
    duration INT NOT NULL,
    bitrate INT NOT NULL,
    size INT NOT NULL,
    upload_at TIMESTAMP DEFAULT NOW(),
    Foreign Key (id_publisher) REFERENCES users(id)
);

-- +goose Down
DROP TABLE musics;

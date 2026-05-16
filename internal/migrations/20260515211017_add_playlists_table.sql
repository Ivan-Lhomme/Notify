-- +goose Up
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_owner UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    private BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    Foreign Key (id_owner) REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE playlists;

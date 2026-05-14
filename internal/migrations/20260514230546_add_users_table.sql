-- +goose Up
CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL,
    pseudo VARCHAR(255),
    email VARCHAR(255),
    passwd VARCHAR(255),
    id_role INT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE users;

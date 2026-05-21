-- +goose Up
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pseudo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwd VARCHAR(255) NOT NULL,
    id_role INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT NOW(),
    Foreign Key (id_role) REFERENCES roles(id)
);

-- +goose Down
DROP TABLE users;

-- +goose Up
CREATE TABLE twofa_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_target UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    nbr_of_check INTEGER DEFAULT 0,
    valid BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    Foreign Key (id_target) REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE twofa_tickets;

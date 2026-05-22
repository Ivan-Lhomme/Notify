-- +goose Up
INSERT INTO roles (name)
VALUES ('ADMIN'),
('ARTIST'),
('USER');

-- +goose Down
DELETE FROM users;
DELETE FROM roles;
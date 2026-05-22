-- +goose Up
CREATE TABLE music_in_playlist (
    id_playlist UUID NOT NULL,
    id_music UUID NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    Foreign Key (id_playlist) REFERENCES playlists(id) ON DELETE CASCADE,
    Foreign Key (id_music) REFERENCES musics(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE music_in_playlist;

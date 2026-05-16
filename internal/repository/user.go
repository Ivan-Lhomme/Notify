package repository

import (
	"database/sql"
	"fioxify-api/internal/models"
	"log"
)

func Change_password(db *sql.DB, user models.User) error {
	query := `UPDATE users SET passwd=$1 WHERE id=$2`

	_,err := db.Exec(query, user.Password, user.UUID)

	return err
}

func Get_all_playlists(db *sql.DB, owner_uuid string) ([]models.Playlist, error) {
	query := `SELECT id, name, private, created_at playlists WHERE id_owner=$1`

	rows, err := db.Query(query, owner_uuid)
	if err != nil {
		log.Println(err)
		return []models.Playlist{}, err
	}
	defer rows.Close()

	var (
		playlists []models.Playlist
		playlist models.Playlist
	)

	for rows.Next() {
		err := rows.Scan(&playlist.UUID, &playlist.Name, &playlist.Private, &playlist.Created_at)
		if err != nil {
			log.Println(err)
			return []models.Playlist{}, err
		}

		playlists = append(playlists, playlist)
	}

	return playlists, nil
}

func Create_playlist(db *sql.DB, new_playlist models.Playlist) error {
	query := `INSERT INTO playlist (id_owner, name, private) VALUES ($1, $2, $3)`

	_,err := db.Exec(query, new_playlist.Id_owner, new_playlist.Name, new_playlist.Private)

	return err
}

func Delete_playlist(db *sql.DB, playlist_uuid string) error {
	query := `DELETE FROM playlists WHERE id=$1`

	_,err := db.Exec(query, playlist_uuid)

	return err
}

func Modify_playlist(db *sql.DB, new_playlist_data models.Playlist) error {
	query := `UPDATE playlists SET name=$1, private=$2 WHERE id=$3`

	_,err := db.Exec(query, new_playlist_data.Name, new_playlist_data.Private, new_playlist_data.UUID)

	return err
}

func Add_music_to_playlist(db *sql.DB, playlist_uuid, music_uuid string) error {
	query := `INSERT INTO music_in_playlist (id_playlist, id_music) VALUES ($1, $2)`

	_,err := db.Exec(query, playlist_uuid, music_uuid)

	return err
}
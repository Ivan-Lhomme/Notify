package repository

import (
	"database/sql"
	"log"
	"notify-api/internal/models"
)

func Change_password(db *sql.DB, user models.User) error {
	query := `UPDATE users SET passwd=$1 WHERE id=$2`

	_,err := db.Exec(query, user.Password, user.UUID)

	return err
}

func Get_one_playlist(db *sql.DB, new_playlist_data models.Playlist) (models.Playlist, error) {
	query := `SELECT * FROM playlists WHERE id=$1 AND id_owner=$2`

	var playlist models.Playlist

	err := db.QueryRow(query, new_playlist_data.UUID, new_playlist_data.Id_owner).Scan(&playlist.UUID, &playlist.Id_owner, &playlist.Name, &playlist.Private, &playlist.Created_at)
	if err != nil {
		log.Println(err)
		return models.Playlist{}, err
	}

	return playlist, nil
}

func Get_all_playlists(db *sql.DB, owner_uuid string) ([]models.Playlist, error) {
	query := `SELECT * FROM playlists WHERE id_owner=$1`
	query2 := `
		SELECT musics.* FROM music_in_playlist
		JOIN musics ON music_in_playlist.id_music = musics.id
		WHERE id_playlist=$1
		ORDER BY added_at
	`

	rows, err := db.Query(query, owner_uuid)
	if err != nil {
		log.Println(err)
		return []models.Playlist{}, err
	}
	defer rows.Close()

	var playlists []models.Playlist
	
	for rows.Next() {
		var playlist models.Playlist
		
		err := rows.Scan(&playlist.UUID, &playlist.Id_owner, &playlist.Name, &playlist.Private, &playlist.Created_at)
		if err != nil {
			log.Println(err)
			return []models.Playlist{}, err
		}

		rows2, err2 := db.Query(query2, playlist.UUID)
		if err2 != nil {
			log.Println(err2)
			return []models.Playlist{}, err2
		}
		
		for rows2.Next() {
			var music models.Music

			err := rows2.Scan(&music.UUID, &music.Id_publisher, &music.Title, &music.Explicit, &music.Plays_count, &music.Duration, &music.Bitrate, &music.Size, &music.Upload_at)
			if err != nil {
				log.Println(err)
				return []models.Playlist{}, err
			}
			
			playlist.Musics = append(playlist.Musics, music)
		}
		
		playlists = append(playlists, playlist)
		rows2.Close()
	}

	return playlists, nil
}

func Create_playlist(db *sql.DB, new_playlist models.Playlist) error {
	query := `INSERT INTO playlists (id_owner, name, private) VALUES ($1, $2, $3)`

	_,err := db.Exec(query, new_playlist.Id_owner, new_playlist.Name, new_playlist.Private)

	return err
}

func Delete_playlist(db *sql.DB, playlist models.Playlist) error {
	query := `DELETE FROM playlists WHERE id=$1 AND id_owner=$2`

	_,err := db.Exec(query, playlist.UUID, playlist.Id_owner)

	return err
}

func Modify_playlist(db *sql.DB, new_playlist_data models.Playlist) error {
	query := `UPDATE playlists SET name=$1, private=$2 WHERE id=$3 AND id_owner=$4`

	_,err := db.Exec(query, new_playlist_data.Name, new_playlist_data.Private, new_playlist_data.UUID, new_playlist_data.Id_owner)

	return err
}

func Add_music_to_playlist(db *sql.DB, playlist_uuid, music_uuid string) error {
	query := `INSERT INTO music_in_playlist (id_playlist, id_music) VALUES ($1, $2)`

	_,err := db.Exec(query, playlist_uuid, music_uuid)

	return err
}

func Delete_music_from_playlist(db *sql.DB, playlist_uuid, music_uuid string) error {
	query := `DELETE FROM music_in_playlist WHERE id_playlist=$1 AND id_music=$2`

	_,err := db.Exec(query, playlist_uuid, music_uuid)

	return err
}

func Get_all_musics_in_playlist(db *sql.DB, playlist models.Playlist) ([]models.Music, error) {
	query := `
		SELECT musics.* FROM musics
		JOIN music_in_playlist ON musics.id = music_in_playlist.id_music
		JOIN playlists ON music_in_playlist.id_playlist = playlists.id
		WHERE playlists.id = $1 AND playlists.id_owner = $2
	`

	rows, err := db.Query(query, playlist.UUID, playlist.Id_owner)
	if err != nil {
		return []models.Music{}, err
	}
	defer rows.Close()

	var (
		musics []models.Music
		music models.Music
	)

	for rows.Next() {
		err = rows.Scan(&music.UUID, &music.Id_publisher, &music.Title, &music.Explicit, &music.Plays_count, &music.Duration, &music.Bitrate, &music.Size, &music.Upload_at)
		if err != nil {
			return []models.Music{}, err
		}

		musics = append(musics, music)
	}

	return musics, nil
}

func Get_one_music(db *sql.DB, music_uuid string) (models.Music, error) {
	query := `SELECT * FROM musics WHERE id=$1`

	var music models.Music
	err := db.QueryRow(query, music_uuid).Scan(&music.UUID, &music.Id_publisher, &music.Title, &music.Explicit, &music.Plays_count, &music.Duration, &music.Bitrate, &music.Size, &music.Upload_at)

	if err != nil {
		return models.Music{}, err
	}

	return music, nil
}

func Pseudo_exist(db *sql.DB, pseudo string) bool {
	query := `SELECT * FROM users WHERE pseudo=$1`

	_, err := db.Exec(query, pseudo)

	return err != nil
}

func Email_exist(db *sql.DB, email string) bool {
	query := `SELECT * FROM users WHERE email=$1`

	_, err := db.Exec(query, email)

	return err != nil
}

func Playlist_exist(db *sql.DB, name, uuid_owner string) bool {
	query := `SELECT * FROM playlists WHERE name=$1 AND id_owner=$2`

	_, err := db.Exec(query, name, uuid_owner)

	return err != nil
}
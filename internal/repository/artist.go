package repository

import (
	"database/sql"

	"fioxify-api/internal/models"
)

func Get_all_musics_from_user(db *sql.DB, user_uuid string) ([]models.Music, error) {
	query := `SELECT * FROM musics WHERE id_owner = $1`

	rows, err := db.Query(query, user_uuid)
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

func Add_music(db *sql.DB, music models.Music) (string, error) {
	query := `
		INSERT INTO musics
			(id_publisher, title, explicit, plays_count, duration, bitrate, size)
		VALUES
			($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`

	var uuid string
	err := db.QueryRow(query, music.Id_publisher, music.Title, music.Explicit, music.Plays_count, music.Duration, music.Bitrate, music.Size).Scan(&uuid)
	
	if err != nil {
		return "", err
	}

	return uuid, nil
}

func Delete_music(db *sql.DB, music models.Music) error {
	query := `DELETE FROM musics WHERE id = $1 AND id_publisher = $2`

	_, err := db.Exec(query, music.UUID, music.Id_publisher)
	if err != nil {
		return err
	}

	return nil
}

func Modify_music(db *sql.DB, music models.Music) error {
	query := `UPDATE musics SET title=$1, explicit=$2 WHERE id=$3`

	_, err := db.Exec(query, music.Title, music.Explicit, music.UUID)
	if err != nil {
		return err
	}

	return nil
}

func Modify_music_play_count(db *sql.DB, music models.Music) error {
	query := `UPDATE musics SET plays_count=$1 WHERE id=$2`

	_, err := db.Exec(query, music.Plays_count, music.UUID)
	if err != nil {
		return err
	}

	return nil
}
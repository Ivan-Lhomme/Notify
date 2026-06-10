package repository

import (
	"database/sql"
	"log"

	"notify-api/internal/models"
)

func Get_one_user(db *sql.DB, UUID string) (models.User, error) {
	query := `SELECT id, pseudo, email, passwd, id_role, created_at FROM users WHERE id=$1`

	var user models.User

	err := db.QueryRow(query, UUID).Scan(&user.UUID, &user.Pseudo, &user.Email, &user.Password, &user.Role, &user.Created_at)
	if err != nil {
		log.Println(err)
		return models.User{}, err
	}

	return user, nil
}

func Delete_user(db *sql.DB, UUID string) error {
	query := `DELETE FROM users WHERE id=$1`

	_, err := db.Exec(query, UUID)

	return err
}

func Modify_user(db *sql.DB, new_user_data models.User) error {
	query := `UPDATE users SET pseudo=$1, email=$2, id_role=$3 WHERE id=$4`

	_, err := db.Exec(query, new_user_data.Pseudo, new_user_data.Email, new_user_data.Role, new_user_data.UUID)

	return err
}

func Get_all_musics(db *sql.DB) ([]models.Music, error) {
	rows, err := db.Query("SELECT * FROM musics")
	
	if err != nil {
		log.Println(err)
		return []models.Music{}, err
	}
	defer rows.Close()

	var (
		musics []models.Music
		music models.Music
	)

	for rows.Next() {
		err := rows.Scan(&music.UUID, &music.Id_publisher, &music.Title, &music.Explicit, &music.Plays_count, &music.Duration, &music.Bitrate, &music.Size, &music.Upload_at)
		if err != nil {
			log.Println(err)
			return []models.Music{}, err
		}

		musics = append(musics, music)
	}

	return musics, nil
}
package repository

import (
	"database/sql"
	"log"
	"time"

	"notify-api/internal/models"
)

func Get_all_users(db *sql.DB) ([]models.User, error) {
	users := []models.User{}

	rows, err := db.Query("SELECT id, pseudo, email, id_role, created_at FROM users")
	if err != nil {
		log.Println(err)
		return []models.User{}, err
	}
	defer rows.Close()
	
	for rows.Next() {
		var user models.User
		err = rows.Scan(&user.UUID, &user.Pseudo, &user.Email, &user.Role, &user.Created_at)
		if err != nil {
			log.Println(err)
			return []models.User{}, err
		}

		rows2, err2 := db.Query("SELECT * FROM musics WHERE id_publisher=$1", user.UUID)
		if err2 != nil {user.Musics = []models.Music{}}

		for rows2.Next() {
			var music models.Music
			err2 = rows2.Scan(&music.UUID, &music.Id_publisher, &music.Title, &music.Explicit, &music.Plays_count, &music.Duration, &music.Bitrate, &music.Size, &music.Upload_at)
			if err2 != nil {break}

			user.Musics = append(user.Musics, music)
		}

		users = append(users, user)
	}

	return users, nil
}

func Add_user(db *sql.DB, new_user models.User) error {
	query := 	`INSERT INTO users (pseudo, email, passwd, id_role)
				VALUES ($1, $2, $3, $4)`
	
	_, err := db.Exec(query, new_user.Pseudo, new_user.Email, new_user.Password, new_user.Role)

	return err
}

func Clear_twofa_ticket(db *sql.DB) {
	query := `DELETE FROM twofa_tickets WHERE NOT valid OR created_at < $1 OR nbr_of_check > 2`

	db.Exec(query, time.Now().Add(-5 * time.Minute))
}

func Delete_music_admin(db *sql.DB, music_uuid string) {
	query := `DELETE FROM musics WHERE id=$1`

	db.Exec(query, music_uuid)
}
package repository

import (
	"database/sql"
	"log"

	"fioxify-api/internal/models"
)

func Get_all_users(db *sql.DB) ([]models.User, error) {
	users := []models.User{}

	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		log.Println(err)
		return []models.User{}, err
	}
	defer rows.Close()

	var user models.User

	for rows.Next() {
		err := rows.Scan(&user.UUID, &user.Pseudo, &user.Email, &user.Password, &user.Role, &user.Created_at)
		if err != nil {
			log.Println(err)
			return []models.User{}, err
		}

		users = append(users, user)
	}

	return users, nil
}

func Get_one_user(db *sql.DB, UUID string) (models.User, error) {
	query := `SELECT id, pseudo, email, passwd, created_at FROM users WHERE id=$1`

	var user models.User

	err := db.QueryRow(query, UUID).Scan(&user.UUID, &user.Pseudo, &user.Email, &user.Password, &user.Created_at)
	if err != nil {
		log.Println(err)
		return models.User{}, err
	}

	return user, nil
}

func Add_user(db *sql.DB, new_user models.User) error {
	query := 	`INSERT INTO users (pseudo, email, passwd, id_role)
				VALUES ($1, $2, $3, $4)`
	
	_, err := db.Exec(query, new_user.Pseudo, new_user.Email, new_user.Password, new_user.Role)

	return err
}

func Delete_user(db *sql.DB, UUID string) error {
	query := `DELETE FROM users WHERE id=$1`

	_, err := db.Exec(query, UUID)

	return err
}

func Modify_user(db *sql.DB, new_user_data models.User) error {
	query := `UPDATE users SET pseudo=$1, email=$2, passwd=$3, id_role=$4 WHERE id=$5`

	_, err := db.Exec(query, new_user_data.Pseudo, new_user_data.Email, new_user_data.Password, new_user_data.Role, new_user_data.UUID)

	return err
}
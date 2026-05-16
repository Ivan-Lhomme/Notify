package repository

import (
	"database/sql"
	"log"

	"fioxify-api/internal/models"
)

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
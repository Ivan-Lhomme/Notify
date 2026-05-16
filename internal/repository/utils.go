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
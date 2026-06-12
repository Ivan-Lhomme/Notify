package repository

import (
	"database/sql"

	"notify-api/internal/models"
)

func Get_user_by_email(db *sql.DB, user_email string) (models.User, error) {
	query := `SELECT id, email, passwd FROM users WHERE email=$1`

	var user models.User
	err := db.QueryRow(query, user_email).Scan(&user.UUID, &user.Email, &user.Password)

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func Add_twofa_ticket(db *sql.DB, tt models.Twofa_ticket) (string, error) {
	query := `INSERT INTO twofa_tickets (id_target, email, code) VALUES ($1, $2, $3) RETURNING id`

	var ticket_uuid string
	err := db.QueryRow(query, tt.Id_target, tt.Email, tt.Code).Scan(&ticket_uuid)

	if err != nil {
		return "", err
	}

	return ticket_uuid, nil
}

func Get_one_twofa_ticket(db *sql.DB, tt_data models.Twofa_ticket) (models.Twofa_ticket, error) {
	query := `SELECT * FROM twofa_tickets WHERE id=$1 AND email=$2`

	var tt models.Twofa_ticket
	err := db.QueryRow(query, tt_data.UUID, tt_data.Email).Scan(&tt.UUID, &tt.Id_target, &tt.Email, &tt.Code, &tt.Nbr_of_ckeck, &tt.Valid, &tt.Created_at)

	if err != nil {
		return models.Twofa_ticket{}, err
	}

	return tt, nil
}

func Delete_one_twofa_ticket(db *sql.DB, tt models.Twofa_ticket) error {
	query := `DELETE FROM twofa_tickets WHERE id=$1 AND id_target=$2 AND email=$3`

	_, err := db.Exec(query, tt.UUID, tt.Id_target, tt.Email)

	return err
}

func Modify_nbr_of_check_twofa_ticket(db *sql.DB, tt models.Twofa_ticket) error {
	query := `UPDATE twofa_tickets SET nbr_of_check=$1 WHERE id=$2 AND email=$3`

	_, err := db.Exec(query, tt.Nbr_of_ckeck, tt.UUID, tt.Email)

	return err
}

func Register_user(db *sql.DB, user models.User) error {
	query := `INSERT INTO users (id, pseudo, email, passwd) VALUES ($1, $2, $3, $4)`

	_, err := db.Exec(query,user.UUID, user.Pseudo, user.Email, user.Password)

	if err != nil {
		return nil
	}

	query = `INSERT INTO playlists (id_owner, name, private) VALUES ($1, $2, $3)`

	_, err = db.Exec(query, user.UUID, "Liked", true)

	return err
}

func Register_user_tmp(db *sql.DB, user models.User) string {
	query := `INSERT INTO users (pseudo, email, passwd) VALUES ($1, $2, $3) RETURNING id`

	var user_uuid string
	db.QueryRow(query, user.Pseudo, user.Email, user.Password).Scan(&user_uuid)

	return user_uuid
}

func Delete_user_temp(db *sql.DB, UUID string) models.User {
	query := `DELETE FROM users WHERE id=$1 RETURNING id, pseudo, email, passwd`

	var user models.User
	db.QueryRow(query, UUID).Scan(&user.UUID, &user.Pseudo, &user.Email, &user.Password)

	return user
}
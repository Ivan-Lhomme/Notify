package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	UUID       string		`json:"uuid"`
	Pseudo     string		`json:"pseudo"`
	Email      string		`json:"email"`
	Password   string		`json:"password"`
	Role       int			`json:"role"`
	Musics     []Music      `json:"musics"`
	Created_at time.Time	`json:"created_at"`
}

func (user *User) Format() error {
	if user.Password != "" && !is_hash(user.Password) {
		pass_hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)

		if err != nil {
			return err
		}

		user.Password = string(pass_hash)
	}

	if user.Role == 0 { user.Role = 3 }
	
	return nil
}

func (user *User) Modify_user(new_user_data User) {
    if new_user_data.Pseudo != "" { user.Pseudo = new_user_data.Pseudo }
	if new_user_data.Email != "" { user.Email = new_user_data.Email }
	if new_user_data.Password != "" { user.Password = new_user_data.Password }
	if new_user_data.Role != 0 { user.Role = new_user_data.Role }
}

func is_hash(p string) bool {
	_, err := bcrypt.Cost([]byte(p))

	return err == nil
}
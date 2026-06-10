package utils

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"notify-api/internal/models"
	"notify-api/internal/repository"

	"github.com/gofiber/fiber/v3"
)

func Unmarshall_user(c fiber.Ctx, u *models.User, fallback_message string, cfg Check_cfg) string {
	err := json.Unmarshal(c.Body(), u)

	if err != nil {
		fmt.Printf("An error occured during the unmarshal process :\n\n%v\n", err)
		return fallback_message
	}

	if err := Check_user_receive(u, cfg); err != "" {
		return err
	}

	if err = u.Format(); err != nil {
		fmt.Printf("An error occured during the user format process :\n\n%v\n", err)
		return fallback_message
	}

	return ""
}

func Unmarshall_user_no_format(c fiber.Ctx, u *models.User, fallback_message string, cfg Check_cfg) string {
	err := json.Unmarshal(c.Body(), u)

	if err != nil {
		fmt.Printf("An error occured during the unmarshal process :\n\n%v\n", err)
		return fallback_message
	}

	if err := Check_user_receive(u, cfg); err != "" {
		return err
	}

	return ""
}

func Check_user_receive(u *models.User, cfg Check_cfg) string {
	switch {
	case u.UUID == "" && cfg.UUID:
		return "No UUID give !"
	case u.Pseudo == "" && cfg.Pseudo:
		return "No pseudo give !"
	case u.Email == "" && cfg.Email:
		return "No email give !"
	case u.Password == "" && cfg.Password:
		return "No password give !"
	}

	return ""
}

func Check_user_info_exist(db *sql.DB, c *fiber.Ctx, user_info models.User, cfg User_exist_cfg) (bool, string) {
	if cfg.Pseudo {
		if repository.Pseudo_exist(db, user_info.Pseudo) {
			(*c).Status(400)
			return true, "Pseudo already exist."
		}
	}

	if cfg.Email {
		if repository.Email_exist(db, user_info.Email) {
			(*c).Status(400)
			return true, "Email already exist."
		}
	}

	return false, ""
}

func Check_playlist_exist(db *sql.DB, c *fiber.Ctx, playlist models.Playlist) (bool, string) {
	if repository.Playlist_exist(db, playlist.Name, playlist.Id_owner) {
		(*c).Status(400)
		return true, "Playlist already exist."
	}

	return false, ""
}

func Check_music_exist(db *sql.DB, c *fiber.Ctx, title string) (bool, string) {
	if repository.Music_exist(db, title) {
		(*c).Status(400)
		return true, "Music already exist."
	}

	return false, ""
}
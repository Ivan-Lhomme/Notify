package utils

import (
	"encoding/json"
	"fmt"

	"notify-api/internal/models"

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
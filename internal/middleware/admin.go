package middleware

import (
	"notify-api/internal/models"

	"github.com/gofiber/fiber/v3"
)

func Admin(c fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if c.Locals("user") == nil {
		return fiber.ErrUnauthorized
	}

	if user.Role != 1 {
		return c.Drop()
	}

	return c.Next()
}
package middleware

import (
	"fioxify-api/internal/models"
	"fmt"

	"github.com/gofiber/fiber/v3"
)

func Login(c fiber.Ctx) error {
	fmt.Println("This is the login middleware !")

	user := models.User{
		Pseudo: "Test",
		Role: 1,
	}
	c.Locals("user", user)

	return c.Next()
}
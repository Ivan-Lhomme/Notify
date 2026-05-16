package middleware

import (
	"fioxify-api/internal/models"
	"fmt"

	"github.com/gofiber/fiber/v3"
)

func User(c fiber.Ctx) error {
	fmt.Println("This is the user middleware !")

	user := c.Locals("user").(models.User)
	fmt.Printf("--> %v", user.Pseudo)
	
	return c.Next()
}
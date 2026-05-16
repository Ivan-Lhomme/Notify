package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v3"
)

func User(c fiber.Ctx) error {
	fmt.Println("This is the user middleware !")
	
	return c.Next()
}
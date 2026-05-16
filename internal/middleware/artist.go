package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v3"
)

func Artist(c fiber.Ctx) error {
	fmt.Println("This is the admin middleware !")

	return c.Next()
}
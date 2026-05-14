package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v3"
)

func Admin(c fiber.Ctx) error {
	fmt.Println("This is the middleware !")

	return c.Next()
}
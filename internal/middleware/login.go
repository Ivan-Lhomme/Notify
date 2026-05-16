package middleware

import (
	"database/sql"
	"fmt"

	"fioxify-api/internal/repository"

	"github.com/gofiber/fiber/v3"
)

func Login(c fiber.Ctx, db *sql.DB) error {
	fmt.Println("This is the login middleware !")

	token_uuid := "1421e958-8f3d-4372-8bea-f84572edcb7c"

	user, err := repository.Get_one_user(db, token_uuid)

	if err != nil {
		c.Status(401)

		return c.End()
	}
	
	c.Locals("user", user)

	return c.Next()
}
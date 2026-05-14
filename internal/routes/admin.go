package routes

import (
	"fmt"

	"fioxify-api/internal/models"

	"github.com/gofiber/fiber/v3"
)

func Admin(app *fiber.App) {
	app.Get("/admin/users", func (c fiber.Ctx) error {
        user := models.Users{
            Pseudo: "Truc",
            Email: "jqds@sd.sdf",
            Password: "sdf93",
        }

        return c.SendString(fmt.Sprintf("%v\n", user))
    })
}
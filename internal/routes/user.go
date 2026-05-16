package routes

import (
	"database/sql"
	"fioxify-api/internal/middleware"
	"fioxify-api/internal/utils"

	"github.com/gofiber/fiber/v3"
)

func User(app *fiber.App, db *sql.DB) {
	user := app.Group("/user", middleware.User)

	user.Get("/profile", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	user.Post("/modify", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	user.Post("/changepassword", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	user.Post("/createplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	user.Post("/deleteplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	user.Post("/modifyplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	user.Post("/addmusictoplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	user.Post("/downloadmusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})
}
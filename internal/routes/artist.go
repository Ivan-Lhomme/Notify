package routes

import (
	"database/sql"
	"fioxify-api/internal/middleware"
	"fioxify-api/internal/utils"

	"github.com/gofiber/fiber/v3"
)

func Artist(app fiber.Router, db *sql.DB) {
	artist := app.Group("/artist", middleware.Artist)

	artist.Get("/musics", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	artist.Post("/addmusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	artist.Post("/deletemusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	artist.Post("/modifymusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})
}
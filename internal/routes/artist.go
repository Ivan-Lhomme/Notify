package routes

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	"fioxify-api/internal/middleware"
	"fioxify-api/internal/models"
	"fioxify-api/internal/repository"
	"fioxify-api/internal/utils"

	"github.com/gofiber/fiber/v3"
)

func Artist(app fiber.Router, db *sql.DB) {
	artist := app.Group("/artist", middleware.Artist)

	artist.Get("/musics", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		user := c.Locals("user").(models.User)
		musics, err := repository.Get_all_musics_from_user(db, user.UUID)

		if err != nil {
			fmt.Printf("An error occured during listing musics of user from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		res_mess.Data = musics
		return c.JSON(res_mess)
	})

	artist.Post("/uploadmusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})

	artist.Post("/deletemusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var music models.Music
		err := unmarshall_music(c, &music)

		if err != nil {
			fmt.Printf("An error occured during deleting music unmarshall from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		user := c.Locals("user").(models.User)
		music.Id_publisher = user.UUID

		err = repository.Delete_music(db, music)
		if err != nil {
			fmt.Printf("An error occured during deleting music querie from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		return c.JSON(res_mess)
	})

	artist.Post("/modifymusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_music_data models.Music
		err := unmarshall_music(c, &new_music_data)

		if err != nil {
			fmt.Printf("An error occured during modifying music unmarshall from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		user := c.Locals("user").(models.User)
		new_music_data.Id_publisher = user.UUID

		var music models.Music
		music, err = repository.Get_one_music_from_user(db, new_music_data)

		if err != nil {
			fmt.Printf("An error occured during modifying music querie 1 from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		music.Modify_music(new_music_data)

		err = repository.Modify_music(db, music)
		if err != nil {
			fmt.Printf("An error occured during modifying music querie 2 from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		return c.JSON(res_mess)
	})

	artist.Post("/addplaycount", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_music_data models.Music
		err := unmarshall_music(c, &new_music_data)

		if err != nil {
			fmt.Printf("An error occured during adding play count to music unmarshall from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		user := c.Locals("user").(models.User)
		new_music_data.Id_publisher = user.UUID

		var music models.Music
		music, err = repository.Get_one_music_from_user(db, new_music_data)

		if err != nil {
			fmt.Printf("An error occured during adding play count to music querie 1 from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		music.Modify_music(new_music_data)

		err = repository.Modify_music_play_count(db, music)
		if err != nil {
			fmt.Printf("An error occured during adding play count to music querie 2 from artist \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		return c.JSON(res_mess)
	})
}

func unmarshall_music(c fiber.Ctx, music *models.Music) error {
	err := json.Unmarshal(c.Body(), music)
	if err != nil {
		return err
	}

	if music.UUID == "" {
		return errors.New("No music id give")
	}

	return nil
}
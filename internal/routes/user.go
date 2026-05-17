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

func User(app fiber.Router, db *sql.DB) {
	user := app.Group("/user", middleware.User)

	//* user routes
	user.Get("/profile", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		res_mess.Data = c.Locals("user")

		return c.JSON(res_mess)
	})

	user.Post("/modify", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_user_data models.User
		err := utils.Unmarshall_user(c, &new_user_data, "nothing", utils.Check_cfg{})

		if err != "" {
			fmt.Printf("An error occured during modify from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		user := c.Locals("user").(models.User)
		user.Modify_user(new_user_data)

		repository.Modify_user(db, user)

		return c.JSON(res_mess)
	})

	user.Post("/changepassword", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_user_data models.User
		err := utils.Unmarshall_user(c, &new_user_data, "nothing", utils.Check_cfg{Password: true})

		if err != "" {
			fmt.Printf("An error occured during change password from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		user := c.Locals("user").(models.User)
		user.Modify_user(new_user_data)

		repository.Modify_user(db, user)

		return c.JSON(res_mess)
	})

	//* playlist routes
	user.Get("/playlists", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		user := c.Locals("user").(models.User)

		playlists, err := repository.Get_all_playlists(db, user.UUID)

		if err != nil {
			fmt.Printf("An error occured during listing all playlists from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		res_mess.Data = playlists

		return c.JSON(res_mess)
	})

	user.Post("/createplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var playlist models.Playlist
		err := unmarshall_playlist(c, &playlist, true)

		if err != nil {
			fmt.Printf("An error occured during playlist creation unmarshall from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		user := c.Locals("user").(models.User)
		playlist.Id_owner = user.UUID

		err = repository.Create_playlist(db, playlist)
		if err != nil {
			fmt.Printf("An error occured during playlist creation querie from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		return c.JSON(res_mess)
	})

	user.Post("/deleteplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var playlist models.Playlist
		err := unmarshall_playlist(c, &playlist, false)

		if err != nil {
			fmt.Printf("An error occured during playlist deletion unmarshall from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		err = repository.Delete_playlist(db, playlist)
		if err != nil {
			fmt.Printf("An error occured during playlist deletion querie from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		return c.JSON(res_mess)
	})

	user.Post("/modifyplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_playlist_data models.Playlist
		err := unmarshall_playlist(c, &new_playlist_data, false)

		if err != nil {
			fmt.Printf("An error occured during playlist modifying unmarshall from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		playlist, err := repository.Get_one_playlist(db, new_playlist_data.UUID)

		if err != nil {
			fmt.Printf("An error occured during playlist modifying querie 1 from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		playlist.Modify_playlist(new_playlist_data)

		err = repository.Modify_playlist(db, playlist)
		if err != nil {
			fmt.Printf("An error occured during playlist modifying querie 2 from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		return c.JSON(res_mess)
	})

	//* music routes
	user.Get("/musics", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		musics, err := repository.Get_all_musics(db)

		if err != nil {
			fmt.Printf("An error occured during get all musics from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		res_mess.Data = musics

		return c.JSON(res_mess)
	})

	user.Post("/musicsinplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var playlist models.Playlist
		err := unmarshall_playlist(c, &playlist, false)
		if err != nil {
			fmt.Printf("An error occured during getting all musics in playlist unmarshall from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		playlist, err = repository.Get_one_playlist(db, playlist.UUID)

		if err != nil {
			fmt.Printf("An error occured during getting all musics in playlis querie 1 from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		musics, err := repository.Get_all_musics_in_playlist(db, playlist)

		if err != nil {
			fmt.Printf("An error occured during get all musics in playlist querie 2 from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		res_mess.Data = musics

		return c.JSON(res_mess)
	})

	user.Post("/addmusictoplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var mtp models.Music_to_playlist
		err := unmarshall_music_to_playlist(c, &mtp)
		if err != nil {
			fmt.Printf("An error occured during adding music to playlist unmarshall from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		err = repository.Add_music_to_playlist(db, mtp.Id_playlist, mtp.Id_music)
		if err != nil {
			fmt.Printf("An error occured during adding music to playlist querie from user \n\n%v\n", err)
			return c.JSON(res_mess)
		}

		return c.JSON(res_mess)
	})

	//TODO
	user.Post("/downloadmusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		return c.JSON(res_mess)
	})
}

func unmarshall_playlist(c fiber.Ctx, p *models.Playlist, check_name bool) error {
	err := json.Unmarshal(c.Body(), p)

	if err != nil {
		return err
	}

	if check_name && p.Name == "" {
		return errors.New("No name give !")
	}

	return nil
}

func unmarshall_music_to_playlist(c fiber.Ctx, mtp *models.Music_to_playlist) error {
	err := json.Unmarshal(c.Body(), mtp)

	if err != nil {
		return err
	}

	if mtp.Id_playlist == "" {
		return errors.New("No playlist id give !")
	}
	if mtp.Id_music == "" {
		return errors.New("No music id give !")
	}

	return nil
}
package routes

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"notify-api/internal/middleware"
	"notify-api/internal/models"
	"notify-api/internal/repository"
	"notify-api/internal/utils"

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
			fmt.Printf("Error in user/modify on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		user.Modify_user(new_user_data)

		err2 := repository.Modify_user(db, user)
		if err2 != nil {
			fmt.Printf("Error in user/modify on querie : \n%v\n", err)
			return c.SendStatus(400)
		}

		return c.JSON(res_mess)
	})

	user.Post("/changepassword", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_user_data models.User
		err := utils.Unmarshall_user(c, &new_user_data, "nothing", utils.Check_cfg{Password: true})

		if err != "" {
			fmt.Printf("Error in user/changepassword on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		user.Modify_user(new_user_data)

		err2 := repository.Modify_user(db, user)
		if err2 != nil {
			fmt.Printf("Error in user/modify on querie : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	//* playlist routes
	user.Get("/playlists", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		user := c.Locals("user").(models.User)

		playlists, err := repository.Get_all_playlists(db, user.UUID)

		if err != nil {
			fmt.Printf("Error in user/playlists on querie : \n%v\n", err)
			return c.SendStatus(500)
		}

		res_mess.Data = playlists

		return c.JSON(res_mess)
	})

	user.Post("/createplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var playlist models.Playlist
		err := unmarshall_playlist(c, &playlist, true)

		if err != nil {
			fmt.Printf("Error in user/createplaylist on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		playlist.Id_owner = user.UUID

		err = repository.Create_playlist(db, playlist)
		if err != nil {
			fmt.Printf("Error in user/createplaylist on querie : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	user.Post("/deleteplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var playlist models.Playlist
		err := unmarshall_playlist(c, &playlist, false)

		if err != nil {
			fmt.Printf("Error in user/deleteplaylist on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		err = repository.Delete_playlist(db, playlist)
		if err != nil {
			fmt.Printf("Error in user/deleteplaylist on querie : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	user.Post("/modifyplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_playlist_data models.Playlist
		err := unmarshall_playlist(c, &new_playlist_data, false)

		if err != nil {
			fmt.Printf("Error in user/modifyplaylist on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)

		new_playlist_data.Id_owner = user.UUID
		playlist, err := repository.Get_one_playlist(db, new_playlist_data)

		if err != nil {
			fmt.Printf("Error in user/modifyplaylist on querie 1 : \n%v\n", err)
			return c.SendStatus(400)
		}

		playlist.Modify_playlist(new_playlist_data)

		err = repository.Modify_playlist(db, playlist)
		if err != nil {
			fmt.Printf("Error in user/modifyplaylist on querie 2 : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	//* music routes
	user.Get("/musics", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		musics, err := repository.Get_all_musics(db)

		if err != nil {
			fmt.Printf("Error in user/musics on querie : \n%v\n", err)
			return c.SendStatus(500)
		}

		res_mess.Data = musics

		return c.JSON(res_mess)
	})

	user.Post("/musicsinplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var playlist models.Playlist
		err := unmarshall_playlist(c, &playlist, false)
		if err != nil {
			fmt.Printf("Error in user/musicsinplaylist on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		playlist.Id_owner = user.UUID
		playlist, err = repository.Get_one_playlist(db, playlist)

		if err != nil {
			fmt.Printf("Error in user/musicsinplaylist on querie 1 : \n%v\n", err)
			return c.SendStatus(400)
		}

		musics, err := repository.Get_all_musics_in_playlist(db, playlist)

		if err != nil {
			fmt.Printf("Error in user/musicsinplaylist on querie 2 : \n%v\n", err)
			return c.SendStatus(500)
		}

		res_mess.Data = musics

		return c.JSON(res_mess)
	})

	user.Post("/addmusictoplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var mtp models.Music_to_playlist
		err := unmarshall_music_to_playlist(c, &mtp)
		if err != nil {
			fmt.Printf("Error in user/addmusictoplaylist on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		playlist := models.Playlist{
			UUID: mtp.Id_playlist,
			Id_owner: user.UUID,
		}
		playlist, err = repository.Get_one_playlist(db, playlist)
		if err != nil {
			fmt.Printf("Error in user/addmusictoplaylist on querie 1 : \n%v\n", err)
			return c.SendStatus(400)
		}

		err = repository.Add_music_to_playlist(db, playlist.UUID, mtp.Id_music)
		if err != nil {
			fmt.Printf("Error in user/addmusictoplaylist on querie 2 : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	user.Post("/deletemusicfromplaylist", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var mtp models.Music_to_playlist
		err := unmarshall_music_to_playlist(c, &mtp)
		if err != nil {
			fmt.Printf("Error in user/addmusictoplaylist on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		playlist := models.Playlist{
			UUID: mtp.Id_playlist,
			Id_owner: user.UUID,
		}
		playlist, err = repository.Get_one_playlist(db, playlist)
		if err != nil {
			fmt.Printf("Error in user/addmusictoplaylist on querie 1 : \n%v\n", err)
			return c.SendStatus(400)
		}

		err = repository.Delete_music_from_playlist(db, playlist.UUID, mtp.Id_music)
		if err != nil {
			fmt.Printf("Error in user/addmusictoplaylist on querie 2 : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	user.Get("/play/:uuid", func (c fiber.Ctx) error {
		uuid := c.Params("uuid")

		music, err := repository.Get_one_music(db, uuid)
		if err != nil {
			return err
		}

		music_file_name := os.Getenv("MUSIC_PATH") + music.UUID + "_" + music.Title + ".ogg"
		return c.SendFile(music_file_name, fiber.SendFile{
			ByteRange: true,
		})
	})

	//TODO
	user.Post("/downloadmusic", func (c fiber.Ctx) error {
		return c.Drop()
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
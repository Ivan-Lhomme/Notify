package routes

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"os/exec"
	"strings"

	"notify-api/internal/middleware"
	"notify-api/internal/models"
	"notify-api/internal/repository"
	"notify-api/internal/utils"

	"github.com/gofiber/fiber/v3"
)

func Artist(app fiber.Router, db *sql.DB) {
	artist := app.Group("/artist", middleware.Artist)

	artist.Get("/musics", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		user := c.Locals("user").(models.User)
		musics, err := repository.Get_all_musics_from_user(db, user.UUID)

		if err != nil {
			fmt.Printf("Error in artist/musics on querie : \n%v\n", err)
			return c.SendStatus(500)
		}

		res_mess.Data = musics
		return c.JSON(res_mess)
	})

	artist.Post("/uploadmusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var (
			music_file_header *multipart.FileHeader
			music_title string
			music_explicit bool
		)

		err := get_form_data(c, &music_file_header, &music_title, &music_explicit)

		if err != nil {
			res_mess.Message = err.Error()
			c.Status(400)

			return c.JSON(res_mess)
		}

		var exist bool
		if exist, res_mess.Message = utils.Check_music_exist(db, &c, music_title); exist { return c.JSON(res_mess) }

		fileType := strings.Split(music_file_header.Header.Get("Content-Type"), "/")
		
		if (fileType[1] == "ogg") {user := c.Locals("user").(models.User)
			music := models.Music{
				Id_publisher: user.UUID,
				Title: music_title,
				Explicit: music_explicit,
				Duration: 0,
				Bitrate: 0,
				Size: int(music_file_header.Size),
			}

			music.UUID, err = repository.Add_music(db, music)
			if err != nil {
				fmt.Printf("Error in artist/uploadmusic on querie : \n%v\n", err)
				return c.SendStatus(500)
			}

			music_file_name := os.Getenv("MUSIC_PATH") + music.UUID + "_" + music.Title + ".ogg"

			err = c.SaveFile(music_file_header, music_file_name)
			if err != nil {
				fmt.Printf("Error in artist/uploadmusic on saving : \n%v\n", err)
				repository.Delete_music(db, music)

				return c.SendStatus(500)
			}

			cmd := exec.Command(
				"ffprobe",
				"-v", "quiet",
				"-print_format", "json",
				"-show_format",
				music_file_name,
			)

			var (
				output []byte
				FFProbe_json utils.FFProbe_Output
			)
			output, err = cmd.Output()

			err = json.Unmarshal(output, &FFProbe_json)

			if err != nil {
				fmt.Printf("An error occured artist/upload unmarshal process :\n\n%v\n", err)

				repository.Delete_music(db, music)
				os.Remove(music_file_name)
				return c.SendStatus(500)
			}

			music.Bitrate = int(FFProbe_json.Format.Bit_rate)
			music.Duration = int(FFProbe_json.Format.Duration)

			err = repository.Complete_music_info(db, music)

			if err != nil {
				fmt.Printf("An error occured artist/upload query :\n\n%v\n", err)

				repository.Delete_music(db, music)
				os.Remove(music_file_name)
				return c.SendStatus(500)
			}
		} else {
			c.Status(400)
			res_mess.Message = "This file isn't an ogg file."
		}

		return c.JSON(res_mess)
	})

	artist.Post("/deletemusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var music models.Music
		err := unmarshall_music(c, &music)

		if err != nil {
			fmt.Printf("Error in artist/deletemusic on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		music.Id_publisher = user.UUID

		music, err = repository.Get_one_music_from_user(db, music)
		if err != nil {
			fmt.Printf("Error in artist/deletemusic on querie 1 : \n%v\n", err)
			return c.SendStatus(400)
		}

		err = repository.Delete_music(db, music)
		if err != nil {
			fmt.Printf("Error in artist/deletemusic on querie 2 : \n%v\n", err)
			return c.SendStatus(500)
		}

		music_file_name := os.Getenv("MUSIC_PATH") + music.UUID + "_" + music.Title + ".ogg"
		err = os.Remove(music_file_name)
		if err != nil {
			fmt.Printf("Error in artist/deletemusic on file delete : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	artist.Post("/modifymusic", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_music_data models.Music
		err := unmarshall_music(c, &new_music_data)

		if err != nil {
			fmt.Printf("Error in artist/modifymusic on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		new_music_data.Id_publisher = user.UUID

		var music models.Music
		music, err = repository.Get_one_music_from_user(db, new_music_data)

		if err != nil {
			fmt.Printf("Error in artist/modifymusic on querie 1 : \n%v\n", err)
			return c.SendStatus(400)
		}

		music_file_name := os.Getenv("MUSIC_PATH") + music.UUID + "_" + music.Title + ".ogg"
		music.Modify_music(new_music_data)

		err = repository.Modify_music(db, music)
		if err != nil {
			fmt.Printf("Error in artist/modifymusic on querie 2 : \n%v\n", err)
			return c.SendStatus(500)
		}
		
		music_file_name_new := os.Getenv("MUSIC_PATH") + music.UUID + "_" + music.Title + ".ogg"
		err = os.Rename(music_file_name, music_file_name_new)
		if err != nil {
			fmt.Printf("Error in artist/modifymusic on file rename : \n%v\n", err)
			return c.SendStatus(500)
		}

		return c.JSON(res_mess)
	})

	artist.Post("/addplaycount", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var new_music_data models.Music
		err := unmarshall_music(c, &new_music_data)

		if err != nil {
			fmt.Printf("Error in artist/addplaycount on unmarshall : \n%v\n", err)
			return c.SendStatus(400)
		}

		user := c.Locals("user").(models.User)
		new_music_data.Id_publisher = user.UUID

		var music models.Music
		music, err = repository.Get_one_music_from_user(db, new_music_data)

		if err != nil {
			fmt.Printf("Error in artist/addplaycount on querie 1 : \n%v\n", err)
			return c.SendStatus(400)
		}

		music.Add_play_count(new_music_data.Plays_count)

		err = repository.Modify_music_play_count(db, music)
		if err != nil {
			fmt.Printf("Error in artist/addplaycount on querie 2 : \n%v\n", err)
			return c.SendStatus(500)
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

func get_form_data(c fiber.Ctx, music_file_header **multipart.FileHeader, music_title *string, music_explicit *bool) error {
	music_file_header_tmp, err := c.FormFile("music")
	if err != nil {
		return err
	}
	*music_file_header = music_file_header_tmp

	music_title_tmp := c.FormValue("title")
	*music_title = music_title_tmp
	if *music_title == "" {
		return errors.New("No title give")
	}

	var music_explicit_tmp bool
	music_explicit_form := c.FormValue("explicit")
	if music_explicit_form == "true" {
		music_explicit_tmp = true
	} else {
		music_explicit_tmp = false
	}
	*music_explicit = music_explicit_tmp

	return nil
}
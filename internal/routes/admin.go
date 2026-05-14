package routes

import (
	"encoding/json"
	"fmt"

	"fioxify-api/internal/middleware"
	"fioxify-api/internal/models"

	"github.com/gofiber/fiber/v3"
)

func Admin(app *fiber.App) {
    admin := app.Group("/admin", middleware.Admin)

	admin.Get("/users", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "Listing successful !",
        }
        var users []models.User

        user1 := models.User{
            Pseudo: "Truc",
            Email: "jqds@sd.sdf",
            Password: "sdf93",
        }
        users = append(users, user1)

        res_mess.Data = users
        return c.JSON(res_mess)
    })

    admin.Post("/createuser", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "User created successfully !",
        }
        
        var new_user models.User
        err := unmarshall_user(c, &new_user, "User not created successfully !", check_cfg{Pseudo: true, Email: true, Password: true})

        if err != "" {
            res_mess.Message = err

            return c.JSON(res_mess)
        }

        res_mess.Data = new_user
        return c.JSON(res_mess)
    })

    admin.Post("/deleteuser", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "User deleted successfully !",
        }

        var old_user models.User
        err := unmarshall_user(c, &old_user, "User not deleted successfully !", check_cfg{UUID: true})

        if err != "" {
            res_mess.Message = err

            return c.JSON(res_mess)
        }

        return c.JSON(res_mess)
    })

    admin.Post("/modifyuser", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "User modify successfully !",
        }

        var new_user_data models.User
        err := unmarshall_user(c, &new_user_data, "User not modify successfully !", check_cfg{})

        if err != "" {
            res_mess.Message = err

            return c.JSON(res_mess)
        }

        res_mess.Data = new_user_data
        return c.JSON(res_mess)
    })
}

func unmarshall_user(c fiber.Ctx, u *models.User, fallback_message string, cfg check_cfg) string {
    err := json.Unmarshal(c.Body(), u)

    if err != nil {
        fmt.Printf("An error occured during the unmarshal process :\n\n%v\n", err)

        return fallback_message
    }

    if err := check_user_receive(u, cfg); err != "" {
        return err
    }

    return ""
}

func check_user_receive(u *models.User, cfg check_cfg) string {
    switch {
        case u.UUID == "" && cfg.UUID: return "No UUID give !"
        case u.Pseudo == "" && cfg.Pseudo: return "No pseudo give !"
        case u.Email == "" && cfg.Email: return "No email give !"
        case u.Password == "" && cfg.Password: return "No password give !"
    }

    return ""
}

type check_cfg struct {
    UUID bool
    Pseudo bool
    Email bool
    Password bool
}
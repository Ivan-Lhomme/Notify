package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"fioxify-api/internal/middleware"
	"fioxify-api/internal/models"
	"fioxify-api/internal/repository"

	"github.com/gofiber/fiber/v3"
)

func Admin(app *fiber.App, db *sql.DB) {
    admin := app.Group("/admin", middleware.Admin)

	admin.Get("/users", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "Listing successful !",
        }
        
        users, err := repository.Get_all_users(db)

        if err != nil {
            fmt.Println(err)
            res_mess.Message = "Listing failed !"

            return c.JSON(res_mess)
        }

        res_mess.Data = users
        return c.JSON(res_mess)
    })

    admin.Post("/createuser", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "User created successfully !",
        }
        fallback_message := "User created failed !"
        
        var new_user models.User
        err := unmarshall_user(c, &new_user, fallback_message, check_cfg{Pseudo: true, Email: true, Password: true})

        if err != "" {
            res_mess.Message = err

            return c.JSON(res_mess)
        }

        err2 := repository.Add_user(db, new_user)
        if err2 != nil {
            fmt.Printf("An error occured during inserting new user from admin \n\n%v\n", err2)
            res_mess.Message = fallback_message
        }

        return c.JSON(res_mess)
    })

    admin.Post("/deleteuser", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "User deleted successfully !",
        }
        fallback_message := "User deleted failed !"

        var user models.User
        err := unmarshall_user(c, &user, fallback_message, check_cfg{UUID: true})

        if err != "" {
            res_mess.Message = err

            return c.JSON(res_mess)
        }

        err2 := repository.Delete_user(db, user.UUID)
        if err2 != nil {
            fmt.Printf("An error occured during deleting user from admin \n\n%v\n", err2)
            res_mess.Message = fallback_message
        }

        return c.JSON(res_mess)
    })

    admin.Post("/modifyuser", func (c fiber.Ctx) error {
        res_mess := models.ReponseJSON{
            Message: "User modify successfully !",
        }

        var new_user_data models.User
        err := unmarshall_user(c, &new_user_data, "User modify failed !", check_cfg{})

        if err != "" {
            res_mess.Message = err

            return c.JSON(res_mess)
        }

        user, err2 := repository.Get_one_user(db, new_user_data.UUID)
        if err2 != nil {
            fmt.Printf("An error occured during getting one user from admin \n\n%v\n", err2)
            return c.JSON(res_mess)
        }
        
        user.Modify_user(new_user_data)

        err2 = repository.Modify_user(db, user)
        if err2 != nil {
            fmt.Printf("An error occured during modifying user from admin \n\n%v\n", err2)
            return c.JSON(res_mess)
        }

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

    if err = u.Format(); err != nil {
        fmt.Printf("An error occured during the user format process :\n\n%v\n", err)
        return fallback_message
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
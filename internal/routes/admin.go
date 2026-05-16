package routes

import (
	"database/sql"
	"fmt"

	"fioxify-api/internal/middleware"
	"fioxify-api/internal/models"
	"fioxify-api/internal/repository"
	"fioxify-api/internal/utils"

	"github.com/gofiber/fiber/v3"
)

func Admin(app fiber.Router, db *sql.DB) {
    admin := app.Group("/admin", middleware.Admin)

	admin.Get("/users", func (c fiber.Ctx) error {
        res_mess := utils.ReponseJSON{
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
        res_mess := utils.ReponseJSON{
            Message: "User created successfully !",
        }
        fallback_message := "User created failed !"
        
        var new_user models.User
        err := utils.Unmarshall_user(c, &new_user, fallback_message, utils.Check_cfg{Pseudo: true, Email: true, Password: true})

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
        res_mess := utils.ReponseJSON{
            Message: "User deleted successfully !",
        }
        fallback_message := "User deleted failed !"

        var user models.User
        err := utils.Unmarshall_user(c, &user, fallback_message, utils.Check_cfg{UUID: true})

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
        res_mess := utils.ReponseJSON{
            Message: "User modify successfully !",
        }
        fallback_message := "User modify failed !"

        var new_user_data models.User
        err := utils.Unmarshall_user(c, &new_user_data, fallback_message, utils.Check_cfg{})

        if err != "" {
            res_mess.Message = err

            return c.JSON(res_mess)
        }

        user, err2 := repository.Get_one_user(db, new_user_data.UUID)
        if err2 != nil {
            fmt.Printf("An error occured during getting one user from admin \n\n%v\n", err2)
            res_mess.Message = fallback_message
            return c.JSON(res_mess)
        }
        
        user.Modify_user(new_user_data)

        err2 = repository.Modify_user(db, user)
        if err2 != nil {
            fmt.Printf("An error occured during modifying user from admin \n\n%v\n", err2)
            res_mess.Message = fallback_message
        }

        return c.JSON(res_mess)
    })
}
package routes

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"notify-api/internal/utils"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func Other(app *fiber.App, db *sql.DB) {
	var (
		exp_a int
		exp_r int
		err error
	)

	exp_a, err = strconv.Atoi(os.Getenv("JWT_EXP_A"))
	if err != nil {
		log.Fatal("Error on jwt exp from env conversion 1")
	}

	exp_r, err = strconv.Atoi(os.Getenv("JWT_EXP_R"))
	if err != nil {
		log.Fatal("Error on jwt exp from env conversion 2")
	}


	tokens_exp := utils.Tokens_exp{
		Access_token: time.Duration(exp_a) * time.Minute,
		Refresh_token: time.Duration(exp_r) * time.Hour,
	}

	app.Get("/refresh", func (c fiber.Ctx) error {
		token_string := c.Cookies("Notify-refresh_token")
		if token_string == "" {
			return fiber.ErrUnauthorized
		}

		token, err := jwt.Parse(token_string, func(t *jwt.Token) (any, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil {
			fmt.Printf("Error in refresh on jwt parse : \n%v\n", err)
			return fiber.ErrUnauthorized
		} else if !token.Valid {
			return fiber.ErrUnauthorized
		}

		claims := token.Claims.(jwt.MapClaims)
		exp := time.Unix(int64(claims["exp"].(float64)), 0)

		if exp.Before(time.Now().Add(time.Duration(-exp_r) * time.Hour)) {
			return fiber.ErrUnauthorized
		}

		expireAt := time.Now().Add(tokens_exp.Access_token)
		var access_token string
		access_token, err = utils.Generate_token(claims["user_id"].(string), expireAt)
		if err != nil {
			fmt.Printf("Error in refresh on jwt generation \n%v\n", err)
			return fiber.ErrUnauthorized
		}

		c.Cookie(&fiber.Cookie{
			Name: "Notify-access_token",
			Value: access_token,
			Expires: expireAt,
			HTTPOnly: true,
		})

		return c.End()
	})

	app.Get("/logout", func (c fiber.Ctx) error {
		c.Cookie(&fiber.Cookie{
			Name: "Notify-access_token",
			Value: "",
			Expires: time.Unix(1, 0),
			HTTPOnly: true,
		})

		c.Cookie(&fiber.Cookie{
			Name: "Notify-refresh_token",
			Value: "",
			Expires: time.Unix(1, 0),
			HTTPOnly: true,
			Path: "/api/refresh",
		})

		return c.End()
	})
}
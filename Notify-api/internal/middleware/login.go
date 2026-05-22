package middleware

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"notify-api/internal/models"
	"notify-api/internal/repository"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func Login(c fiber.Ctx, db *sql.DB) error {
	token_string := c.Cookies("Notify-access_token")
	if token_string == "" {
		return fiber.ErrUnauthorized
	}

	token, err := jwt.Parse(token_string, func(t *jwt.Token) (any, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		fmt.Printf("Error in login middleware on jwt parse : \n%v\n", err)
		return fiber.ErrUnauthorized
	} else if !token.Valid {
		return fiber.ErrUnauthorized
	}

	claims := token.Claims.(jwt.MapClaims)
	exp := time.Unix(int64(claims["exp"].(float64)), 0)

	var exp_a int
	exp_a, err = strconv.Atoi(os.Getenv("JWT_EXP_A"))
	if err != nil {
		log.Fatal("Error on jwt exp from env conversion")
	}

	if exp.Before(time.Now().Add(time.Duration(-exp_a) * time.Minute)) {
		return fiber.ErrUnauthorized
	}

	user_uuid := claims["user_id"].(string)

	var user models.User
	user, err = repository.Get_one_user(db, user_uuid)

	if err != nil {
		return fiber.ErrUnauthorized
	}
	
	c.Locals("user", user)

	return c.Next()
}
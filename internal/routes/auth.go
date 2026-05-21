package routes

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand/v2"
	"os"
	"strconv"
	"time"

	"notify-api/internal/models"
	"notify-api/internal/repository"
	"notify-api/internal/utils"

	"github.com/gofiber/fiber/v3"
	"golang.org/x/crypto/bcrypt"
)

func Auth(app fiber.Router, db *sql.DB) {
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
		Access_token: time.Now().Add(time.Duration(exp_a) * time.Minute),
		Refresh_token: time.Now().Add(time.Duration(exp_r) * time.Minute),
	}

//? -------------------------- Login --------------------------
	app.Post("/login", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}
		var user_receive models.User

		err_str := utils.Unmarshall_user_no_format(c, &user_receive, "", utils.Check_cfg{ Email: true, Password: true })
		if err_str != "" {
			res_mess.Message = err_str

			c.Status(403)
			return c.JSON(res_mess)
		}

		user, err := repository.Get_user_by_email(db, user_receive.Email)
		if err != nil {
			fmt.Printf("Error in auth/login on querie \n%v\n", err)
			res_mess.Message = "Wrong email !"

			c.Status(403)
			return c.JSON(res_mess)
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(user_receive.Password))
		if err != nil {
			fmt.Printf("Error in auth/login on password check \n%v\n", err)
			res_mess.Message = "Wrong password !"

			c.Status(403)
			return c.JSON(res_mess)
		}

		code := gen_random_code()
		tt := models.Twofa_ticket{
			Id_target: user.UUID,
			Email: user.Email,
			Code: code,
		}

		tt.Format()

		tt.UUID, err = repository.Add_twofa_ticket(db, tt)
		if err != nil {
			fmt.Printf("Error in auth/login on twofa ticket creating \n%v\n", err)
			return c.SendStatus(500)
		}

		err = utils.Send_mail(user.Email, code, true)
		if err != nil {
			fmt.Printf("Error in auth/login on sending mail \n%v\n", err)

			repository.Delete_one_twofa_ticket(db, tt)
			return c.SendStatus(500)
		}

		tt.Id_target = ""
		tt.Code = ""

		res_mess.Data = tt
		return c.JSON(res_mess)
	})

	app.Post("/login2fa", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var tt_receive models.Twofa_ticket
		err := json.Unmarshal(c.Body(), &tt_receive)

		if err != nil {
			return c.SendStatus(400)
		}

		err = check_twofa_ticket(tt_receive)
		if err != nil {
			res_mess.Message = err.Error()

			c.Status(400)
			return c.JSON(res_mess)
		}

		var tt models.Twofa_ticket
		tt, err = repository.Get_one_twofa_ticket(db, tt_receive)
		if err != nil {
			fmt.Printf("Error in auth/login2fa on querie 1 \n%v\n", err)
			return c.SendStatus(400)
		}

		err = verify_ticket(tt)
		if err != nil {
			repository.Delete_one_twofa_ticket(db, tt)
			res_mess.Message = err.Error()

			c.Status(403)
			return c.JSON(res_mess)
		}

		err = bcrypt.CompareHashAndPassword([]byte(tt.Code), []byte(tt_receive.Code))
		if err != nil {
			tt.Nbr_of_ckeck = tt.Nbr_of_ckeck + 1
			repository.Modify_nbr_of_check_twofa_ticket(db, tt)

			return c.SendStatus(403)
		}

		err = repository.Delete_one_twofa_ticket(db, tt)
		if err != nil {
			fmt.Printf("Error in auth/login2fa on querie 2 \n%v\n", err)
			res_mess.Message = "An unexpected error occured please retry."

			c.Status(500)
			return c.JSON(res_mess)
		}

		var tokens utils.Tokens
		tokens, err = utils.Gen_tokens(tt.Id_target, tokens_exp)
		if err != nil {
			fmt.Printf("Error in auth/login2fa on jwt generation \n%v\n", err)
			res_mess.Message = "An unexpected error occured please retry."

			c.Status(500)
			return c.JSON(res_mess)
		}

		c.Cookie(&fiber.Cookie{
			Name: "Notify-access_token",
			Value: tokens.Access_token,
			Expires: tokens_exp.Access_token,
			HTTPOnly: true,
		})

		c.Cookie(&fiber.Cookie{
			Name: "Notify-refresh_token",
			Value: tokens.Refresh_token,
			Expires: tokens_exp.Refresh_token,
			HTTPOnly: true,
			Path: "/refresh",
		})

		return c.JSON(res_mess)
	})

//? -------------------------- Register --------------------------
	app.Post("/preregister", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var user_receive models.User
		err_str := utils.Unmarshall_user(c, &user_receive, "An error occured please retry", utils.Check_cfg{ Pseudo: true, Email: true, Password: true })
		if err_str != "" {
			res_mess.Message = err_str

			c.Status(400)
			return c.JSON(res_mess)
		}

		user_uuid := repository.Register_user_tmp(db, user_receive)
		if user_uuid == "" {
			fmt.Printf("Error in auth/preregister on querie 1")

			return c.SendStatus(500)
		}

		code := gen_random_code()
		tt := models.Twofa_ticket{
			Id_target: user_uuid,
			Email: user_receive.Email,
			Code: code,
		}

		tt.Format()

		tt.UUID, err = repository.Add_twofa_ticket(db, tt)
		if err != nil {
			fmt.Printf("Error in auth/preregister on twofa ticket creation \n%v\n", err)
			return c.SendStatus(500)
		}

		err = utils.Send_mail(user_receive.Email, code, false)
		if err != nil {
			fmt.Printf("Error in auth/preregister on sending mail \n%v\n", err)

			repository.Delete_one_twofa_ticket(db, tt)
			return c.SendStatus(500)
		}

		tt.Id_target = ""
		tt.Code = ""

		res_mess.Data = tt
		return c.JSON(res_mess)
	})

	app.Post("/register", func (c fiber.Ctx) error {
		res_mess := utils.ReponseJSON{}

		var tt_receive models.Twofa_ticket
		err := json.Unmarshal(c.Body(), &tt_receive)
		if err != nil {
			return c.SendStatus(400)
		}

		err = check_twofa_ticket(tt_receive)
		if err != nil {
			res_mess.Message = err.Error()

			c.Status(400)
			return c.JSON(res_mess)
		}

		var tt models.Twofa_ticket
		tt, err = repository.Get_one_twofa_ticket(db, tt_receive)
		if err != nil {
			fmt.Printf("Error in auth/register on querie 1 \n%v\n", err)
			return c.SendStatus(400)
		}

		err = verify_ticket(tt)
		if err != nil {
			repository.Delete_one_twofa_ticket(db, tt)
			res_mess.Message = err.Error()

			c.Status(403)
			return c.JSON(res_mess)
		}

		err = bcrypt.CompareHashAndPassword([]byte(tt.Code), []byte(tt_receive.Code))
		if err != nil {
			tt.Nbr_of_ckeck = tt.Nbr_of_ckeck + 1
			repository.Modify_nbr_of_check_twofa_ticket(db, tt)

			return c.SendStatus(403)
		}

		user := repository.Delete_user_temp(db, tt.Id_target)
		err = repository.Register_user(db, user)
		if err != nil {
			fmt.Printf("Error in auth/register on register user \n%v\n", err)
			res_mess.Message = "An unexpected error occured please retry."

			c.Status(500)
			return c.JSON(res_mess)
		}
		
		err = repository.Delete_one_twofa_ticket(db, tt)
		if err != nil {
			fmt.Printf("Error in auth/register on querie 2 \n%v\n", err)
			res_mess.Message = "An unexpected error occured please retry."

			c.Status(500)
			return c.JSON(res_mess)
		}

		var tokens utils.Tokens
		tokens, err = utils.Gen_tokens(tt.Id_target, tokens_exp)
		if err != nil {
			fmt.Printf("Error in auth/register on jwt generation \n%v\n", err)
			res_mess.Message = "An unexpected error occured please retry."

			c.Status(500)
			return c.JSON(res_mess)
		}

		c.Cookie(&fiber.Cookie{
			Name: "Notify-access_token",
			Value: tokens.Access_token,
			Expires: tokens_exp.Access_token,
			HTTPOnly: true,
		})

		c.Cookie(&fiber.Cookie{
			Name: "Notify-refresh_token",
			Value: tokens.Refresh_token,
			Expires: tokens_exp.Refresh_token,
			HTTPOnly: true,
			Path: "/refresh",
		})

		return c.JSON(res_mess)
	})
}

func gen_random_code() string {
	code := ""

	randchar := [4]int{}

	for range 6 {
		randchar[0] = rand.IntN(10) + 48 //? number
		randchar[1] = rand.IntN(10) + 48 //? number
		randchar[2] = rand.IntN(26) + 65 //? cap letter
		randchar[3] = rand.IntN(26) + 97 //? letter

		code = code + string(rune(randchar[rand.IntN(4)]))
	}

	return code
}

func check_twofa_ticket(tt models.Twofa_ticket) error {
	switch {
		case tt.UUID == "" : return errors.New("No ticket uuid give")
		case tt.Email == "" : return errors.New("No email give")

		default: return nil
	}
}

func verify_ticket(tt models.Twofa_ticket) error {
	switch {
	case !tt.Valid : return errors.New("Ticket not valid")
	case tt.Nbr_of_ckeck > 100 : return errors.New("Ticket not valid")
	case tt.Created_at.Before(time.Now().Add(-5 * time.Minute)) : return errors.New("Ticket not valid")

	default : return nil
	}
}

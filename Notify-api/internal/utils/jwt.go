package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func Generate_token(user_id string, exp time.Time) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user_id,
		"exp":     exp.Unix(),
	})

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return t, nil
}

func Gen_tokens(user_id string, tokens_exp Tokens_exp) (Tokens, error) {
	access_token, err := Generate_token(user_id, time.Now().Add(tokens_exp.Access_token))
	if err != nil {
		return Tokens{}, err
	}

	var refresh_token string
	refresh_token, err = Generate_token(user_id, time.Now().Add(tokens_exp.Refresh_token))
	if err != nil {
		return Tokens{}, err
	}

	return Tokens{
		Access_token:  access_token,
		Refresh_token: refresh_token,
	}, nil
}

type Tokens struct {
	Access_token  string
	Refresh_token string
}
type Tokens_exp struct {
	Access_token  time.Duration
	Refresh_token time.Duration
}
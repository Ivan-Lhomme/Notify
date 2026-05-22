package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

type Twofa_ticket struct {
	UUID         string 	`json:"uuid"`
	Id_target    string 	`json:"id_target"`
	Email        string 	`json:"email"`
	Code         string 	`json:"code"`
	Nbr_of_ckeck uint8 		`json:"nbr_of_check"`
	Valid        bool 		`json:"valid"`
	Created_at   time.Time 	`json:"create_at"`
}

func (tt *Twofa_ticket) Format() error {
	if tt.Code != "" && !is_hash(tt.Code) {
		pass_hash, err := bcrypt.GenerateFromPassword([]byte(tt.Code), 12)

		if err != nil {
			return err
		}

		tt.Code = string(pass_hash)
	}
	
	return nil
}
package models

import "time"

type User struct {
	UUID       string		`json:"uuid"`
	Pseudo     string		`json:"pseudo"`
	Email      string		`json:"email"`
	Password   string		`json:"password"`
	Role       string		`json:"role"`
	Created_at time.Time	`json:"created_at"`
}
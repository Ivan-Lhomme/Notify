package models

import "time"

type Music_to_playlist struct {
	Id_playlist string 		`json:"id_playlist"`
	Id_music    string 		`json:"id_music"`
	Added_at    time.Time 	`json:"added_at"`
}
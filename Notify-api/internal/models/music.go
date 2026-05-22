package models

import "time"

type Music struct {
	UUID         string 	`json:"uuid"`
	Id_publisher string 	`json:"id_publisher"`
	Title        string 	`json:"title"`
	Explicit     bool 		`json:"explicit"`
	Plays_count  int    	`json:"plays_count"`
	Duration     int    	`json:"duration"`
	Bitrate      int    	`json:"bitrate"`
	Size         int    	`json:"size"`
	Upload_at    time.Time 	`json:"upload_at"`
}

func (music *Music) Modify_music(new_music_data Music) {
	if new_music_data.Title != "" { music.Title = new_music_data.Title }
	music.Explicit = new_music_data.Explicit
}

func (music *Music) Add_play_count(nbr int) {
	music.Plays_count = music.Plays_count + nbr
}
package models

import "time"

type Music struct {
	UUID         string 	`json:"uuid"`
	Id_publisher string 	`json:"id_publisher"`
	Title        string 	`json:"title"`
	Explicit     string 	`json:"explicit"`
	Plays_count  int    	`json:"plays_count"`
	Duration     int    	`json:"duration"`
	Bitrate      int    	`json:"bitrate"`
	Size         int    	`json:"size"`
	Upload_at    time.Time 	`json:"upload_at"`
}
package models

type Playlist struct {
	UUID       string `json:"uuid"`
	Id_owner   string `json:"id_owner"`
	Name       string `json:"name"`
	Private    bool   `json:"private"`
	Created_at string `json:"created_at"`
}
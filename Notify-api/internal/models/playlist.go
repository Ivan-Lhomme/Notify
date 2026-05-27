package models

type Playlist struct {
	UUID       string  `json:"uuid"`
	Id_owner   string  `json:"id_owner"`
	Name       string  `json:"name"`
	Private    bool    `json:"private"`
	Musics     []Music `json:"musics"`
	Created_at string  `json:"created_at"`
}

func (playlist *Playlist) Modify_playlist(new_playlist_data Playlist) {
	if new_playlist_data.Name != "" {
		playlist.Name = new_playlist_data.Name
	}
	playlist.Private = new_playlist_data.Private
}
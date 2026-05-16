package utils

type ReponseJSON struct {
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type Check_cfg struct {
	UUID     bool
	Pseudo   bool
	Email    bool
	Password bool
}
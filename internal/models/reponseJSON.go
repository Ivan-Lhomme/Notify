package models

type ReponseJSON struct {
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}
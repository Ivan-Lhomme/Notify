package utils

type ReponseJSON struct {
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
}

type Check_cfg struct {
	UUID     bool
	Pseudo   bool
	Email    bool
	Password bool
}

type User_exist_cfg struct {
	Pseudo bool
	Email  bool
}

type Format struct {
	Filename         string  `json:"filename"`
	Nb_streams       int8    `json:"nb_streams"`
	Nb_programs      int8    `json:"nb_programs"`
	Nb_stream_groups int8    `json:"nb_stream_groups"`
	Format_name      string  `json:"format_name"`
	Format_long_name string  `json:"format_long_name"`
	Start_time       float64 `json:"start_time,string"`
	Duration         float64 `json:"duration,string"`
	Size             uint64  `json:"size,string"`
	Bit_rate         uint64  `json:"bit_rate,string"`
	Probe_score      int16   `json:"probe_score"`
}

type FFProbe_Output struct {
	Format Format `json:"format"`
}
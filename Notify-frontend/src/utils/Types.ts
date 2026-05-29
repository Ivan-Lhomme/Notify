export type Playlist = {
  uuid: string;
  id_owner: string;
  name: string;
  private: boolean;
  musics: Music[];
  created_at: string;
};

export type Music = {
  uuid: string;
  id_publisher: string;
  title: string;
  explicit: boolean;
  plays_count: number;
  duration: number;
  bitrate: number;
  size: number;
  upload_at: string;
};

export type HomeRoute = {
  profile: boolean;
  playlist: boolean;
};

export type Ticket2fa = {
  uuid: string;
  email: string;
  code: string;
  valid: boolean;
};

export type ActualMusicInfo = {
  music: Music;
  progress: string;
  currentTime: string;
  playing: boolean;
};

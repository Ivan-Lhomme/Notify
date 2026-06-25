export type Playlist = {
  uuid: string;
  id_owner: string;
  name: string;
  private: boolean;
  musics: Music[];
  created_at: string;
};

export class Music {
  uuid = "";
  id_publisher = "";
  title = "";
  explicit = false;
  plays_count = 0;
  duration = 0;
  bitrate = 0;
  size = 0;
  liked = false;
  upload_at = "";
}

export type HomeRoute = {
  profile: boolean;
  playlist: boolean;
  createPlaylist: boolean;
  search: boolean;
  queue: boolean;
};

export type Ticket2fa = {
  uuid: string;
  email: string;
  code: string;
  valid: boolean;
};

export type ActualMusic = {
  music: Music;
  progress: string;
  currentTime: string;
  playing: boolean;
  number: number;
};

export type User = {
  uuid: string;
  pseudo: string;
  email: string;
  role: number;
  musics?: Music[];
  created_at: string;
};

export type AdminPanelRoute = {
  musics: boolean;
  user: boolean;
};

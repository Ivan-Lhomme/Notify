import type { Dispatch, SetStateAction } from "react";
import type {
  ActualMusic,
  AdminPanelRoute,
  HomeRoute,
  Music,
  Playlist,
  Ticket2fa,
  User,
} from "./Types";

export type PlaylistsProps = {
  playlists: Playlist[];
  setPlaylist: Dispatch<SetStateAction<Playlist | null>>;
  setPlaylistRoute: Function;
  newQueue: Function;
  limit?: number;
};

export type PlaylistBarProps = {
  playlists: Playlist[];
  setPlaylist: Dispatch<SetStateAction<Playlist | null>>;
  setPlaylistRoute: Function;
  setRoute: Dispatch<SetStateAction<HomeRoute>>;
  setSearch: Dispatch<SetStateAction<string>>;
};

export type PlaylistProps = {
  playlist: Playlist;
  newQueue: Function;
  resetRoute: Function;
  playlistsFetch: Function;
  musicsFetch: Function;
};

export type UpperBarProps = {
  setRoute: Dispatch<SetStateAction<HomeRoute>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

export type QueueProps = {
  queue: Music[];
  actualMusic: ActualMusic;
};

export type PlayingBarProps = {
  queue: Music[];
  actualMusic: ActualMusic;
  setActualMusic: React.Dispatch<React.SetStateAction<ActualMusic>>;
};

export type MusicsProps = {
  musics: Music[];
  newQueue: Function;
  playlistsFetch: Function;
  musicsFetch: Function;
  playlists: Playlist[];
  limit?: number;
};

export type CreatePlaylistProps = {
  resetRoute: Function;
  playlistsFetch: Function;
};

export type PreRegisterProps = {
  setTicket: React.Dispatch<React.SetStateAction<Ticket2fa>>;
};

export type RegisterProps = {
  ticket: Ticket2fa;
  setTicket: React.Dispatch<React.SetStateAction<Ticket2fa>>;
};

export type AdminUpperBarProps = {
  route: AdminPanelRoute;
  setRoute: React.Dispatch<React.SetStateAction<AdminPanelRoute>>;
};

export type AdminMusicsListProps = {
  musics: Music[];
  deleteMusic: Function;
};

export type AdminUsersProps = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  reloadUsers: Function;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setRoute: React.Dispatch<React.SetStateAction<AdminPanelRoute>>;
};

export type AdminUserProps = {
  user: User;
  deleteMusic: Function;
};

export type ActualMusicInfoProps = {
  currentMusic: Music;
};

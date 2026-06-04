import type { Dispatch, SetStateAction } from "react";
import type {
  ActualMusic,
  HomeRoute,
  Music,
  Playlist,
  Ticket2fa,
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
};

export type PlaylistProps = {
  playlist: Playlist;
  newQueue: Function;
  resetRoute: Function;
  playlistsFetch: Function;
};

export type UpperBarProps = {
  setRoute: Dispatch<SetStateAction<HomeRoute>>;
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

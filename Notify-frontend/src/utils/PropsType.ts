import type { Dispatch, SetStateAction } from "react";
import type { ActualMusic, HomeRoute, Music, Playlist } from "./Types";

export type PlaylistsProps = {
  playlists: Playlist[];
  setPlaylist: Dispatch<SetStateAction<Playlist | null>>;
  setPlaylistRoute: Function;
  newQueue: Function;
};

export type PlaylistBarProps = {
  playlists: Playlist[];
};

export type PlaylistProps = {
  playlist: Playlist;
  newQueue: Function;
};

export type UpperBarProps = {
  setRoute: Dispatch<SetStateAction<HomeRoute>>;
};

export type QueueProps = {
  queue: Music[];
};

export type PlayingBarProps = {
  queue: Music[];
  actualMusic: ActualMusic;
  setActualMusic: React.Dispatch<React.SetStateAction<ActualMusic>>;
};

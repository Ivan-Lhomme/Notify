import type { Dispatch, SetStateAction } from "react";
import type { HomeRoute, Playlist } from "./Types";

export type PlaylistsProps = {
  playlists: Playlist[];
  setPlaylist: Dispatch<SetStateAction<Playlist | null>>;
  setPlaylistRoute: Function;
};

export type PlaylistBarProps = {
  playlists: Playlist[];
};

export type PlaylistProps = {
  playlist: Playlist;
};

export type UpperBarProps = {
  setRoute: Dispatch<SetStateAction<HomeRoute>>;
};

import type { Playlist } from "./Types";

export type HomeProps = {
  route?: string;
};

export type PlaylistsProps = {
  playlists: Playlist[];
};

export type PlaylistBarProps = {
  playlists: Playlist[];
};

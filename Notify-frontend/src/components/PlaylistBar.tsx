import type { PlaylistBarProps } from "../utils/PropsType";

export default function PlaylistBar({ playlists }: PlaylistBarProps) {
  return (
    <div>
      {playlists &&
        playlists.map((playlist) => (
          <div key={playlist.uuid}>{playlist.name}</div>
        ))}
    </div>
  );
}

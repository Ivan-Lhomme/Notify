import type { PlaylistsProps } from "../utils/PropsType";
import styles from "../assets/css/home.module.css";

export default function Playlists({
  playlists,
  setPlaylist,
  setPlaylistRoute,
}: PlaylistsProps) {
  return (
    <div className={styles["playlists"]}>
      <div>
        {playlists &&
          playlists.map((playlist) => (
            <div
              className={styles["playlistCard"]}
              key={playlist.uuid}
              onClick={() => {
                setPlaylist(playlist);
                setPlaylistRoute();
              }}
            >
              <p className={styles["playlistName"]}>{playlist.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

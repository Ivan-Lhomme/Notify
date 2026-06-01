import type { PlaylistsProps } from "../utils/PropsType";
import styles from "../assets/css/home.module.css";
import { useState } from "react";

export default function Playlists({
  playlists,
  setPlaylist,
  setPlaylistRoute,
  newQueue,
  limit,
}: PlaylistsProps) {
  const [currentPlaylistUuid, setCurrentPlaylistUuid] = useState("");

  return (
    <div className={styles["playlists"]}>
      <div>
        {playlists &&
          playlists.map((playlist, index) => {
            if (limit && index >= limit) return;

            return (
              <div
                className={styles["playlistCard"]}
                key={playlist.uuid}
                onClick={() => {
                  setPlaylist(playlist);
                  setPlaylistRoute();
                }}
                onMouseEnter={() => setCurrentPlaylistUuid(playlist.uuid)}
                onMouseLeave={() => setCurrentPlaylistUuid("")}
              >
                <p className={styles["playlistName"]}>{playlist.name}</p>
                {playlist.uuid === currentPlaylistUuid && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      newQueue(playlist.musics);
                    }}
                  >
                    ▶️
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

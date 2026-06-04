import type { MusicsProps } from "../utils/PropsType";
import { useState } from "react";
import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/musics.module.css";

export default function Musics({
  musics,
  newQueue,
  playlistsFetch,
  playlists,
  limit,
}: MusicsProps) {
  const [currentMusicUuid, setCurrentMusicUuid] = useState("");
  const [showSelectPlaylist, setShowSelectPlaylist] = useState(false);

  const handleSelectPlaylist = async (playlistUuid: string) => {
    await apiFetch("/api/user/addmusictoplaylist", "POST", {
      id_playlist: playlistUuid,
      id_music: currentMusicUuid,
    });

    setShowSelectPlaylist(false);
    playlistsFetch();
  };

  return (
    <div className={styles["container"]}>
      {musics &&
        musics.map((music, index) => {
          if (limit && index >= limit) return;

          return (
            <div
              className={styles["music"]}
              key={music.uuid}
              onMouseEnter={() => setCurrentMusicUuid(music.uuid)}
              onMouseLeave={() => {
                setShowSelectPlaylist(false);
                setCurrentMusicUuid("");
              }}
            >
              <p>{music.title}</p>

              <div>
                {music.uuid === currentMusicUuid && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        newQueue([music]);
                      }}
                    >
                      ▶️
                    </button>

                    {showSelectPlaylist && (
                      <div>
                        {playlists.map((playlist) => (
                          <p
                            key={playlist.uuid}
                            onClick={() => handleSelectPlaylist(playlist.uuid)}
                          >
                            {playlist.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <button onClick={() => setShowSelectPlaylist(true)}>➕</button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

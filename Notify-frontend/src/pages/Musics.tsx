import type { MusicsProps } from "../utils/PropsType";
import { useState } from "react";
import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/musics.module.css";
import { FaHeart, FaPlay, FaRegHeart } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

export default function Musics({
  musics,
  newQueue,
  playlistsFetch,
  musicsFetch,
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

  const liked = async (musicUuid: string) => {
    const res = await apiFetch(`/api/user/liked/${musicUuid}`, "GET");

    if (res.ok) {
      playlistsFetch();
      musicsFetch();
    }
  };
  const unliked = async (musicUuid: string) => {
    const res = await apiFetch(`/api/user/unliked/${musicUuid}`, "GET");

    if (res.ok) {
      playlistsFetch();
      musicsFetch();
    }
  };

  return (
    <div className={styles["container"]}>
      {musics.map((music, index) => {
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
                    <FaPlay />
                  </button>

                  {showSelectPlaylist && (
                    <div>
                      {playlists.map((playlist) => {
                        if (playlist.name !== "Liked") {
                          return (
                            <p
                              key={playlist.uuid}
                              onClick={() =>
                                handleSelectPlaylist(playlist.uuid)
                              }
                            >
                              {playlist.name}
                            </p>
                          );
                        }
                      })}
                    </div>
                  )}
                </>
              )}
              <button onClick={() => setShowSelectPlaylist(true)}>
                <IoMdAdd color="blue" />
              </button>
              {music.liked ? (
                <button onClick={() => unliked(music.uuid)}>
                  <FaHeart />
                </button>
              ) : (
                <button onClick={() => liked(music.uuid)}>
                  <FaRegHeart />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

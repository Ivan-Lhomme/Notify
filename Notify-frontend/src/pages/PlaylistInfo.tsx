import { useEffect, useState } from "react";
import apiFetch from "../utils/apiFetch";
import type { PlaylistProps } from "../utils/PropsType";
import type { Music } from "../utils/Types";
import styles from "../assets/css/playlist.module.css";

export default function PlaylistInfo({
  playlist,
  newQueue,
  resetRoute,
  playlistsFetch,
}: PlaylistProps) {
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [modifyingName, setModifyingName] = useState(false);

  useEffect(() => setPlaylistName(playlist.name), [playlist]);

  const handlePlaylistDelete = async () => {
    const answer = prompt(
      `Are you sure to delete the playlist " ${playlist.name} " ?\n(enter the playlist name)`,
    );

    if (answer === playlist.name) {
      await apiFetch("/api/user/deleteplaylist", "POST", {
        uuid: playlist.uuid,
      });

      playlistsFetch();
      resetRoute();
    }
  };

  const handleDeleteMusic = async (music: Music) => {
    const answer = prompt(
      `Are you sure to delete the music " ${music.title} " ?\n(enter the music title)`,
    );

    if (answer === music.title) {
      await apiFetch("/api/user/deletemusicfromplaylist", "POST", {
        id_playlist: playlist.uuid,
        id_music: music.uuid,
      });

      playlistsFetch();
    }
  };

  const handleEnterPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && playlistName !== playlist.name) {
      await apiFetch("/api/user/modifyplaylist", "POST", {
        uuid: playlist.uuid,
        name: playlistName,
        private: false,
      });

      playlistsFetch();
      setModifyingName(false);
    } else if (e.key === "Enter" && playlistName === playlist.name) {
      setModifyingName(false);
    }
  };

  return (
    <div className={styles["playlist"]}>
      <h1>
        {modifyingName ? (
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            onKeyDown={handleEnterPress}
          />
        ) : (
          <p onClick={() => setModifyingName(true)}>{playlistName}</p>
        )}
        {playlist.private && " 🔒"}
      </h1>
      <button onClick={handlePlaylistDelete}>🗑️</button>
      <button onClick={() => newQueue(playlist.musics)}>▶️</button>
      <div>
        {playlist.musics &&
          playlist.musics.map((music, index) => (
            <div key={music.uuid + index}>
              <p>{index + 1}</p>
              <p>{music.title}</p>
              <p>{music.duration}</p>

              <button onClick={() => handleDeleteMusic(music)}>🗑️</button>
            </div>
          ))}
      </div>
    </div>
  );
}

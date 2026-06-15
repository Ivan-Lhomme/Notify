import type { PlaylistBarProps } from "../utils/PropsType";
import styles from "../assets/css/playlistBar.module.css";
import { IoMdAdd } from "react-icons/io";

export default function PlaylistBar({
  playlists,
  setPlaylist,
  setPlaylistRoute,
  setRoute,
  setSearch,
}: PlaylistBarProps) {
  const createPlaylist = () => {
    setSearch("");
    setRoute((prev) => {
      return {
        ...prev,
        profile: false,
        playlist: false,
        createPlaylist: true,
        search: false,
      };
    });
  };

  return (
    <div className={styles["sidebarContainer"]}>
      <button onClick={createPlaylist} className={styles["createButton"]}>
        <IoMdAdd />
      </button>

      <div className={styles["playlistList"]}>
        {playlists &&
          playlists.map((playlist) => (
            <div
              key={playlist.uuid}
              onClick={() => {
                setSearch("");
                setPlaylist(playlist);
                setPlaylistRoute();
              }}
              className={styles["playlistItem"]}
            >
              {playlist.name}
            </div>
          ))}
      </div>
    </div>
  );
}

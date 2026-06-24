import type { UpperBarButtonsProps } from "../utils/PropsType";

export default function UpperBarButtons({
  setRoute,
  setSearch,
  styles,
  artistRef,
  adminRef,
  closeMenu,
}: UpperBarButtonsProps) {
  const profile = () => {
    if (closeMenu) closeMenu();
    setSearch("");
    setRoute((prev) => {
      return {
        ...prev,
        profile: true,
        playlist: false,
        createPlaylist: false,
        search: false,
      };
    });
  };

  const queue = () => {
    if (closeMenu) closeMenu();
    setRoute((prev) => {
      return {
        ...prev,
        queue: true,
      };
    });
  };

  const actualMusicInfo = () => {
    if (closeMenu) closeMenu();
    setRoute((prev) => {
      return {
        ...prev,
        queue: false,
      };
    });
  };

  const upload = () => {
    if (closeMenu) closeMenu();
    window.location.href = "/upload";
  };

  const admin = () => {
    if (closeMenu) closeMenu();
    window.location.href = "/admin";
  };

  return (
    <div>
      <button onClick={profile}>Profile</button>
      <button onClick={queue}>Queue</button>
      <button onClick={actualMusicInfo}>Music</button>
      {artistRef.current && (
        <button className={styles["uploadBtn"]} onClick={upload}>
          Upload
        </button>
      )}
      {adminRef.current && (
        <button className={styles["adminBtn"]} onClick={admin}>
          Admin Panel
        </button>
      )}
    </div>
  );
}

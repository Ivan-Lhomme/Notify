import { useEffect, useRef } from "react";
import type { UpperBarProps } from "../utils/PropsType";
import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/upperBar.module.css";

export default function UpperBar({ setRoute }: UpperBarProps) {
  const artistRef = useRef(false);
  useEffect(() => {
    apiFetch("/api/artist", "GET").then(
      (res) => (artistRef.current = res.status === 404),
    );
  }, []);

  const home = () => {
    setRoute((route) => {
      return {
        ...route,
        profile: false,
        playlist: false,
        createPlaylist: false,
      };
    });
  };

  const profile = () => {
    setRoute((route) => {
      return {
        ...route,
        profile: true,
        playlist: false,
        createPlaylist: false,
      };
    });
  };

  const queue = () => {
    setRoute((route) => {
      return {
        ...route,
        queue: true,
      };
    });
  };

  const actualMusicInfo = () => {
    setRoute((route) => {
      return {
        ...route,
        queue: false,
      };
    });
  };

  return (
    <div className={styles["container"]}>
      <button onClick={home}>🏠</button>
      <input
        type="search"
        name="searchBar"
        id={styles["searchBar"]}
        placeholder="Search..."
      />
      <button onClick={profile}>Profile</button>
      <button onClick={queue}>Queue</button>
      <button onClick={actualMusicInfo}>Music</button>
      {artistRef && (
        <button onClick={() => (window.location.href = "/upload")}>
          Upload
        </button>
      )}
    </div>
  );
}

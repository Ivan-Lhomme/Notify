import { useEffect, useRef } from "react";
import type { UpperBarProps } from "../utils/PropsType";
import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/upperBar.module.css";

export default function UpperBar({
  setRoute,
  search,
  setSearch,
}: UpperBarProps) {
  const artistRef = useRef(false);
  const adminRef = useRef(false);
  useEffect(() => {
    apiFetch("/api/artist", "GET").then(
      (res) => (artistRef.current = res.status === 404),
    );

    apiFetch("/api/admin", "GET").then(
      (res) => (adminRef.current = res.status === 404),
    );
  }, []);

  const home = () => {
    setSearch("");
    setRoute((prev) => {
      return {
        ...prev,
        profile: false,
        playlist: false,
        createPlaylist: false,
        search: false,
      };
    });
  };

  const profile = () => {
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
    setRoute((prev) => {
      return {
        ...prev,
        queue: true,
      };
    });
  };

  const actualMusicInfo = () => {
    setRoute((prev) => {
      return {
        ...prev,
        queue: false,
      };
    });
  };

  return (
    <div className={styles["container"]}>
      <button onClick={home}>🏠</button>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);

          if (e.target.value === "") {
            setRoute((prev) => {
              return {
                ...prev,
                profile: false,
                playlist: false,
                createPlaylist: false,
                search: false,
              };
            });

            return;
          }

          setRoute((prev) => {
            return {
              ...prev,
              profile: false,
              playlist: false,
              createPlaylist: false,
              search: true,
            };
          });
        }}
        type="search"
        name="searchBar"
        id={styles["searchBar"]}
        placeholder="Search..."
      />
      <button onClick={profile}>Profile</button>
      <button onClick={queue}>Queue</button>
      <button onClick={actualMusicInfo}>Music</button>
      {artistRef.current && (
        <button
          className={styles["uploadBtn"]}
          onClick={() => (window.location.href = "/upload")}
        >
          Upload
        </button>
      )}
      {adminRef.current && (
        <button
          className={styles["adminBtn"]}
          onClick={() => (window.location.href = "/admin")}
        >
          Admin Panel
        </button>
      )}
    </div>
  );
}

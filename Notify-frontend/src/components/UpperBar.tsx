import { useEffect, useRef } from "react";
import type { UpperBarProps } from "../utils/PropsType";
import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/upperBar.module.css";
import { GoHome, GoHomeFill } from "react-icons/go";
import UpperBarButtons from "./UpperBarButtons";
import BurgerMenu from "./BurgerMenu";

export default function UpperBar({
  route,
  setRoute,
  search,
  setSearch,
  isPhone,
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

  const isHome = (): boolean => {
    return !route.createPlaylist && !route.playlist && !route.profile;
  };

  return (
    <div className={styles["container"]}>
      <button onClick={home}>{isHome() ? <GoHomeFill /> : <GoHome />}</button>
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
      {isPhone ? (
        <BurgerMenu
          setRoute={setRoute}
          setSearch={setSearch}
          styles={styles}
          artistRef={artistRef}
          adminRef={adminRef}
        />
      ) : (
        <UpperBarButtons
          setRoute={setRoute}
          setSearch={setSearch}
          styles={styles}
          artistRef={artistRef}
          adminRef={adminRef}
        />
      )}
    </div>
  );
}

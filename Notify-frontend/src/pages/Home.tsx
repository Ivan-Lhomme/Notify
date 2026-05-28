import ActualMusicInfo from "../components/AcutalMusicInfo";
import PlaylistBar from "../components/PlaylistBar";
import UpperBar from "../components/UpperBar";
import Playlists from "./Playlists";
import Profile from "./Profile";
import { useEffect, useState } from "react";
import apiFetch from "../utils/apiFetch";
import PlayingBar from "../components/PlayingBar";
import styles from "../assets/css/home.module.css";
import PlaylistInfo from "./PlaylistInfo";
import type { HomeRoute, Playlist } from "../utils/Types";

export default function Home() {
  const [route, setRoute] = useState<HomeRoute>({
    profile: false,
    playlist: false,
  });
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const setPlaylistRoute = () => {
    setRoute({
      profile: false,
      playlist: true,
    });
  };

  const fetch = () => {
    apiFetch("/api/user/playlists", "GET").then((res) => {
      res.json().then((body) => setPlaylists(body.data));
    });
  };
  useEffect(fetch, []);

  if (playlists.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <UpperBar setRoute={setRoute} />

      <div className={styles["middle"]}>
        <PlaylistBar playlists={playlists} />
        {route.profile ? (
          <Profile />
        ) : route.playlist && playlist ? (
          <PlaylistInfo playlist={playlist} />
        ) : (
          <Playlists
            playlists={playlists}
            setPlaylist={setPlaylist}
            setPlaylistRoute={setPlaylistRoute}
          />
        )}
        <ActualMusicInfo />
      </div>

      <PlayingBar />
    </>
  );
}

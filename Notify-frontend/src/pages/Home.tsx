import ActualMusicInfo from "../components/AcutalMusicInfo";
import PlaylistBar from "../components/PlaylistBar";
import UpperBar from "../components/UpperBar";
import Playlists from "../components/Playlists";
import Profile from "./Profile";
import { useState } from "react";
import apiFetch from "../utils/apiFetch";
import PlayingBar from "../components/PlayingBar";
import type { HomeProps } from "../utils/PropsType";
import styles from "../assets/css/home.module.css";

export default function Home({ route }: HomeProps) {
  const [data, setData] = useState({
    start: true,
    playlists: [],
  });

  const fetchData = async () => {
    const res = await apiFetch("/api/user/playlists", "GET");
    setData({
      start: false,
      playlists: (await res.json()).data,
    });
  };

  if (data.start) {
    fetchData();
    return <p>Loading...</p>;
  }

  console.log(data);

  return (
    <>
      <UpperBar />

      <div className={styles["middle"]}>
        <PlaylistBar playlists={data.playlists} />
        {route === "profile" ? (
          <Profile />
        ) : (
          <Playlists playlists={data.playlists} />
        )}
        <ActualMusicInfo />
      </div>

      <PlayingBar />
    </>
  );
}

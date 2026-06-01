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
import type { ActualMusic, HomeRoute, Music, Playlist } from "../utils/Types";
import Queue from "../components/Queue";
import Musics from "./Musics";
import CreatePlaylist from "./CreatePlaylist";

export default function Home() {
  const [route, setRoute] = useState<HomeRoute>({
    profile: false,
    playlist: false,
    createPlaylist: false,
    queue: false,
  });
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [musics, setMusics] = useState<Music[]>([]);
  const [queue, setQueue] = useState<Music[]>([]);
  const [actualMusic, setActualMusic] = useState<ActualMusic>({
    music: {
      uuid: "",
      id_publisher: "",
      title: "",
      explicit: false,
      plays_count: 0,
      duration: 0,
      bitrate: 0,
      size: 0,
      upload_at: "",
    },
    progress: "0",
    currentTime: "0:00",
    playing: false,
    number: -1,
  });

  const setPlaylistRoute = () => {
    setRoute({
      ...route,
      profile: false,
      playlist: true,
    });
  };

  const resetRoute = () => {
    setRoute((prev) => {
      return {
        ...prev,
        profile: false,
        playlist: false,
        createPlaylist: false,
      };
    });
  };

  const newQueue = (queue: Music[]) => {
    setQueue(queue);
    if (queue.length > 0)
      setActualMusic({
        ...actualMusic,
        music: queue[0],
        number: 0,
      });
  };

  const playlistsFetch = () => {
    apiFetch("/api/user/playlists", "GET").then((res) =>
      res.json().then((body) => {
        const playlistsTmp = body.data;

        if (playlist) {
          for (const p of playlistsTmp) {
            if (p.uuid === playlist.uuid) {
              setPlaylist(p);
            }
          }
        }

        setPlaylists(playlistsTmp);
      }),
    );
  };

  const fetch = () => {
    playlistsFetch();

    apiFetch("/api/user/musics", "GET").then((res) =>
      res.json().then((body) => setMusics(body.data)),
    );
  };
  useEffect(fetch, []);

  if (playlists.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles["home"]}>
      <UpperBar setRoute={setRoute} />

      <div className={styles["middle"]}>
        <PlaylistBar
          playlists={playlists}
          setPlaylist={setPlaylist}
          setPlaylistRoute={setPlaylistRoute}
          setRoute={setRoute}
        />
        {route.profile ? (
          <Profile />
        ) : route.playlist && playlist ? (
          <PlaylistInfo
            playlist={playlist}
            newQueue={newQueue}
            resetRoute={resetRoute}
            playlistsFetch={playlistsFetch}
          />
        ) : route.createPlaylist ? (
          <CreatePlaylist
            resetRoute={resetRoute}
            playlistsFetch={playlistsFetch}
          />
        ) : (
          <div className={styles["container"]}>
            <Playlists
              playlists={playlists}
              setPlaylist={setPlaylist}
              setPlaylistRoute={setPlaylistRoute}
              newQueue={newQueue}
              limit={6}
            />
            <Musics
              musics={musics}
              newQueue={newQueue}
              playlistsFetch={playlistsFetch}
              playlists={playlists}
            />
          </div>
        )}

        {route.queue ? <Queue queue={queue} /> : <ActualMusicInfo />}
      </div>

      <PlayingBar
        queue={queue}
        actualMusic={actualMusic}
        setActualMusic={setActualMusic}
      />
    </div>
  );
}

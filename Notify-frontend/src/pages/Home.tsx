import ActualMusicInfo from "../components/AcutalMusicInfo";
import PlaylistBar from "../components/PlaylistBar";
import UpperBar from "../components/UpperBar";
import Playlists from "./Playlists";
import Profile from "./Profile";
import { useEffect, useRef, useState } from "react";
import apiFetch from "../utils/apiFetch";
import PlayingBar from "../components/PlayingBar";
import styles from "../assets/css/home.module.css";
import PlaylistInfo from "./PlaylistInfo";
import type { ActualMusic, HomeRoute, Music, Playlist } from "../utils/Types";
import Queue from "../components/Queue";
import Musics from "./Musics";
import CreatePlaylist from "./CreatePlaylist";

export default function Home() {
  const chargeRef = useRef(false);
  const [route, setRoute] = useState<HomeRoute>({
    profile: false,
    playlist: false,
    createPlaylist: false,
    search: false,
    queue: true,
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
    currentTime: "-:--",
    playing: false,
    number: -1,
  });
  const [search, setSearch] = useState("");

  const setPlaylistRoute = () => {
    setRoute((prev) => {
      return {
        ...prev,
        profile: false,
        playlist: true,
        createPlaylist: false,
        search: false,
      };
    });
  };

  const resetRoute = () => {
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

        if (playlistsTmp && playlist) {
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

    chargeRef.current = true;
  };
  useEffect(fetch, []);

  if (!chargeRef) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles["home"]}>
      <UpperBar setRoute={setRoute} search={search} setSearch={setSearch} />

      <div className={styles["middle"]}>
        <PlaylistBar
          playlists={playlists}
          setPlaylist={setPlaylist}
          setPlaylistRoute={setPlaylistRoute}
          setRoute={setRoute}
          setSearch={setSearch}
        />
        {route.search ? (
          <Musics
            musics={musics.filter((music) =>
              music.title.toLowerCase().includes(search.toLowerCase()),
            )}
            newQueue={newQueue}
            playlistsFetch={playlistsFetch}
            playlists={playlists}
          />
        ) : route.profile ? (
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
            {playlists && (
              <Playlists
                playlists={playlists}
                setPlaylist={setPlaylist}
                setPlaylistRoute={setPlaylistRoute}
                newQueue={newQueue}
                limit={6}
              />
            )}

            {playlists && musics && <div className={styles["separator"]} />}

            {musics && (
              <Musics
                musics={musics}
                newQueue={newQueue}
                playlistsFetch={playlistsFetch}
                playlists={playlists}
              />
            )}
          </div>
        )}

        {route.queue ? (
          <Queue queue={queue} actualMusic={actualMusic} />
        ) : (
          <ActualMusicInfo />
        )}
      </div>

      <PlayingBar
        queue={queue}
        actualMusic={actualMusic}
        setActualMusic={setActualMusic}
      />
    </div>
  );
}

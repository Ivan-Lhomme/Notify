import { useEffect, useRef, useState } from "react";
import apiFetch from "../utils/apiFetch";
import { apiLocation } from "../utils/apiLocation";
import type { PlayingBarProps } from "../utils/PropsType";
import styles from "../assets/css/playingBar.module.css";
import { GrPowerCycle } from "react-icons/gr";
import { IoShuffle } from "react-icons/io5";
import type { Music } from "../utils/Types";
import { FaPause, FaPlay } from "react-icons/fa";

export default function PlayingBar({
  queue,
  actualMusic,
  setActualMusic,
  shuffle,
  setShuffle,
  shuffled,
}: PlayingBarProps) {
  const musicRef = useRef<HTMLAudioElement>(null);
  const [sliding, setSliding] = useState(false);
  const [cycle, setCycle] = useState(true);

  const handleProgress = () => {
    if (!musicRef.current || sliding) return;

    const progress = (
      (musicRef.current.currentTime / actualMusic.music.duration) *
      100
    ).toString();

    setActualMusic((prev) => {
      return {
        ...prev,
        progress: progress,
      };
    });
  };

  const modifySlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!musicRef.current) return;

    const min = Math.floor(
      ((Number(e.target.value) / 100) * actualMusic.music.duration) / 60,
    );
    const sec = Math.floor(
      ((Number(e.target.value) / 100) * actualMusic.music.duration) % 60,
    );

    let sec_str = sec.toString();

    if (sec < 10) {
      sec_str = `0${sec_str}`;
    }

    setActualMusic((prev) => {
      return {
        ...prev,
        progress: e.target.value,
        currentTime: `${min}:${sec_str}`,
      };
    });
  };

  const handleSlider = () => {
    if (!musicRef.current) return;

    musicRef.current.currentTime =
      (Number(actualMusic.progress) / 100) * actualMusic.music.duration;
  };

  const startMusic = async () => {
    if (!musicRef.current || actualMusic.music.uuid === "") return;

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${actualMusic.music.uuid}`;

    await musicRef.current.play();
    setActualMusic((prev) => {
      if (!musicRef.current) return prev;

      return {
        ...prev,
        playing: true,
      };
    });
  };

  const unpauseMusic = async () => {
    if (!musicRef.current) return;

    musicRef.current.play();
    setActualMusic((prev) => {
      return { ...prev, playing: true };
    });
  };

  const pauseMusic = async () => {
    if (!musicRef.current) return;

    musicRef.current.pause();
    setActualMusic((prev) => {
      return { ...prev, playing: false };
    });
  };

  const getActualTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);

    let sec_str = sec.toString();

    if (sec < 10) {
      sec_str = `0${sec_str}`;
    }

    return `${min}:${sec_str}`;
  };

  const handleMusicEnd = async () => {
    const newMusicNumber = actualMusic.number + 1;
    const newMusic = queue[newMusicNumber];

    if (shuffle && !newMusic) {
      setToMusic(shuffled());
      return;
    }

    if (!cycle && !newMusic) {
      setActualMusic((prev) => {
        return { ...prev, playing: false };
      });

      return;
    }

    nextMusic();
  };

  const nextMusic = async () => {
    const musicNumber =
      actualMusic.number + 1 < queue.length ? actualMusic.number + 1 : 0;

    if (shuffle && musicNumber === 0) {
      setToMusic(shuffled());
      return;
    }

    const newMusic = queue[musicNumber];

    if (!newMusic || !musicRef.current) {
      setActualMusic((prev) => {
        return { ...prev, playing: false };
      });

      return;
    }

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${newMusic.uuid}`;

    await musicRef.current.play();

    setActualMusic((prev) => {
      return {
        ...prev,
        music: newMusic,
        progress: "0",
        currentTime: "-:--",
        playing: true,
        number: musicNumber,
      };
    });
  };

  const previousMusic = async () => {
    const musicNumber =
      actualMusic.number - 1 >= 0 ? actualMusic.number - 1 : queue.length - 1;

    const newMusic = queue[musicNumber];

    if (!newMusic || !musicRef.current) {
      setActualMusic((prev) => {
        return { ...prev, playing: false };
      });

      return;
    }

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${newMusic.uuid}`;

    await musicRef.current.play();

    setActualMusic((prev) => {
      return {
        ...prev,
        music: newMusic,
        progress: "0",
        currentTime: "-:--",
        playing: true,
        number: musicNumber,
      };
    });
  };

  const setToMusic = async (music: Music) => {
    if (!musicRef.current) return;

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${music.uuid}`;

    await musicRef.current.play();

    music.duration = musicRef.current.duration;
    setActualMusic((prev) => {
      return {
        ...prev,
        music: music,
        progress: "0",
        currentTime: "-:--",
        playing: true,
        number: 0,
      };
    });
  };

  useEffect(() => {
    if (!navigator.mediaSession) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: actualMusic.music.title,
    });

    navigator.mediaSession.setActionHandler(
      "play",
      musicRef.current?.src ? unpauseMusic : startMusic,
    );
    navigator.mediaSession.setActionHandler("pause", pauseMusic);
    navigator.mediaSession.setActionHandler("nexttrack", nextMusic);
    navigator.mediaSession.setActionHandler("previoustrack", previousMusic);
    navigator.mediaSession.setActionHandler("stop", startMusic);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("stop", null);
    };
  }, [actualMusic]);

  useEffect(() => {
    if (!navigator.mediaSession) return;

    navigator.mediaSession.playbackState = actualMusic.playing
      ? "playing"
      : "paused";
  }, [actualMusic.playing]);

  return (
    <div className={styles["music-player"]}>
      <div className={styles["controls"]}>
        <button onClick={() => setShuffle((prev) => !prev)}>
          {shuffle ? <IoShuffle color="blue" /> : <IoShuffle />}
        </button>

        <button onClick={previousMusic}>⏮</button>
        <button
          className={styles["play-btn"]}
          onClick={
            actualMusic.playing
              ? pauseMusic
              : musicRef.current?.src
                ? unpauseMusic
                : startMusic
          }
        >
          {actualMusic.playing ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={nextMusic}>⏭</button>

        <button onClick={() => setCycle((prev) => !prev)}>
          {cycle ? <GrPowerCycle color="blue" /> : <GrPowerCycle />}
        </button>
      </div>

      <div className={styles["progress-container"]}>
        <p>
          {!sliding && musicRef.current
            ? getActualTime(musicRef.current.currentTime)
            : actualMusic.currentTime}
        </p>
        <input
          type="range"
          name="musicProgress"
          id="musicProgress"
          value={actualMusic.progress}
          onChange={modifySlider}
          onMouseDown={() => {
            setSliding(true);
          }}
          onMouseUp={() => {
            setSliding(false);
            handleSlider();
          }}
          style={
            {
              "--progress": `${actualMusic.progress}%`,
            } as React.CSSProperties
          }
        />
        <p>
          {actualMusic.music.duration > 0
            ? getActualTime(actualMusic.music.duration)
            : "-:--"}
        </p>
      </div>
      {musicRef && (
        <audio
          ref={musicRef}
          onTimeUpdate={handleProgress}
          onEnded={handleMusicEnd}
        />
      )}
    </div>
  );
}

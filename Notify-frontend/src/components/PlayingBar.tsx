import { useRef, useState } from "react";
import apiFetch from "../utils/apiFetch";
import { apiLocation } from "../utils/apiLocation";
import type { PlayingBarProps } from "../utils/PropsType";
import styles from "../assets/css/playingBar.module.css";

export default function PlayingBar({
  queue,
  actualMusic,
  setActualMusic,
}: PlayingBarProps) {
  const musicRef = useRef<HTMLAudioElement>(null);
  const [sliding, setSliding] = useState(false);

  const handleProgress = () => {
    if (!musicRef.current || sliding) return;

    const progress = (
      (musicRef.current.currentTime / actualMusic.music.duration) *
      100
    ).toString();

    setActualMusic({
      ...actualMusic,
      progress: progress,
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

    setActualMusic({
      ...actualMusic,
      progress: e.target.value,
      currentTime: `${min}:${sec_str}`,
    });
  };

  const handleSlider = () => {
    if (!musicRef.current) return;

    musicRef.current.currentTime =
      (Number(actualMusic.progress) / 100) * actualMusic.music.duration;
  };

  const startMusic = async () => {
    if (!musicRef.current || actualMusic.music.uuid === "") return;

    if (
      musicRef.current.src !== "" &&
      Math.floor(musicRef.current.currentTime) ===
        Math.floor(actualMusic.music.duration)
    ) {
      await musicRef.current.play();
      setActualMusic({
        ...actualMusic,
        playing: true,
      });
    }

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${actualMusic.music.uuid}`;

    await musicRef.current.play();
    setActualMusic({
      ...actualMusic,
      music: {
        ...actualMusic.music,
        duration: musicRef.current.duration,
      },
      playing: true,
    });
  };

  const unpauseMusic = async () => {
    if (!musicRef.current) return;

    musicRef.current.play();
    setActualMusic({
      ...actualMusic,
      playing: true,
    });
  };

  const pauseMusic = async () => {
    if (!musicRef.current) return;

    musicRef.current.pause();
    setActualMusic({
      ...actualMusic,
      playing: false,
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
    const musicNumber = actualMusic.number + 1;
    const newMusic = queue[musicNumber];

    if (!newMusic || !musicRef.current) {
      setActualMusic({
        ...actualMusic,
        playing: false,
      });

      return;
    }

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${newMusic.uuid}`;

    await musicRef.current.play();

    newMusic.duration = musicRef.current.duration;
    setActualMusic({
      ...actualMusic,
      music: newMusic,
      progress: "0",
      currentTime: "-:--",
      playing: false,
      number: musicNumber,
    });
  };

  const nextMusic = async () => {
    const musicNumber =
      actualMusic.number + 1 < queue.length ? actualMusic.number + 1 : 0;

    const newMusic = queue[musicNumber];

    if (!newMusic || !musicRef.current) {
      setActualMusic({
        ...actualMusic,
        playing: false,
      });

      return;
    }

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${newMusic.uuid}`;

    await musicRef.current.play();

    newMusic.duration = musicRef.current.duration;
    setActualMusic({
      ...actualMusic,
      music: newMusic,
      progress: "0",
      currentTime: "-:--",
      playing: true,
      number: musicNumber,
    });
  };

  const previousMusic = async () => {
    const musicNumber =
      actualMusic.number - 1 >= 0 ? actualMusic.number - 1 : queue.length - 1;

    const newMusic = queue[musicNumber];

    if (!newMusic || !musicRef.current) {
      setActualMusic({
        ...actualMusic,
        playing: false,
      });

      return;
    }

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${newMusic.uuid}`;

    await musicRef.current.play();

    newMusic.duration = musicRef.current.duration;
    setActualMusic({
      ...actualMusic,
      music: newMusic,
      progress: "0",
      currentTime: "-:--",
      playing: true,
      number: musicNumber,
    });
  };

  return (
    <div className={styles["music-player"]}>
      <div className={styles["controls"]}>
        <button onClick={previousMusic}>⏮️</button>
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
          {actualMusic.playing ? "⏸️" : "▶️"}
        </button>
        <button onClick={nextMusic}>⏭️</button>
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

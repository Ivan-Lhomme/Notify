import { useRef, useState } from "react";
import apiFetch from "../utils/apiFetch";
import { apiLocation } from "../utils/apiLocation";
import type { ActualMusicInfo } from "../utils/Types";

export default function PlayingBar() {
  const musicRef = useRef<HTMLAudioElement>(null);
  const [sliding, setSliding] = useState(false);
  const [actualMusicInfo, setActualMusicInfo] = useState<ActualMusicInfo>({
    music: {
      uuid: "52909db3-f9df-489b-99c0-d29452be109a",
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
  });

  const handleProgress = () => {
    if (!musicRef.current || sliding) return;

    const progress = (
      (musicRef.current.currentTime / actualMusicInfo.music.duration) *
      100
    ).toString();

    setActualMusicInfo({
      ...actualMusicInfo,
      progress: progress,
    });
  };

  const modifySlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!musicRef.current) return;

    const min = Math.floor(
      ((Number(e.target.value) / 100) * actualMusicInfo.music.duration) / 60,
    );
    const sec = Math.floor(
      ((Number(e.target.value) / 100) * actualMusicInfo.music.duration) % 60,
    );

    let sec_str = sec.toString();

    if (sec < 10) {
      sec_str = `0${sec_str}`;
    }

    setActualMusicInfo({
      ...actualMusicInfo,
      progress: e.target.value,
      currentTime: `${min}:${sec_str}`,
    });
  };

  const handleSlider = () => {
    if (!musicRef.current) return;

    musicRef.current.currentTime =
      (Number(actualMusicInfo.progress) / 100) * actualMusicInfo.music.duration;
  };

  const startMusic = async () => {
    if (!musicRef.current) return;

    if (
      musicRef.current.src !== "" &&
      Math.floor(musicRef.current.currentTime) ===
        Math.floor(actualMusicInfo.music.duration)
    ) {
      await musicRef.current.play();
      setActualMusicInfo({
        ...actualMusicInfo,
        playing: true,
      });
    }

    await apiFetch("/refresh", "GET");
    musicRef.current.src = `${apiLocation}/api/user/play/${actualMusicInfo.music.uuid}`;

    await musicRef.current.play();
    setActualMusicInfo({
      ...actualMusicInfo,
      music: {
        ...actualMusicInfo.music,
        duration: musicRef.current.duration,
      },
      playing: true,
    });
  };

  const unpauseMusic = async () => {
    if (!musicRef.current) return;

    musicRef.current.play();
    setActualMusicInfo({
      ...actualMusicInfo,
      playing: true,
    });
  };

  const pauseMusic = async () => {
    if (!musicRef.current) return;

    musicRef.current.pause();
    setActualMusicInfo({
      ...actualMusicInfo,
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

  return (
    <div>
      <div>
        <button>⏮️</button>
        <button
          onClick={
            actualMusicInfo.playing
              ? pauseMusic
              : musicRef.current?.src
                ? unpauseMusic
                : startMusic
          }
        >
          {actualMusicInfo.playing ? "⏸️" : "▶️"}
        </button>
        <button>⏭️</button>
      </div>
      <div>
        <p>
          {!sliding && musicRef.current
            ? getActualTime(musicRef.current.currentTime)
            : actualMusicInfo.currentTime}
        </p>
        <input
          type="range"
          name="musicProgress"
          id="musicProgress"
          value={actualMusicInfo.progress}
          onChange={modifySlider}
          onMouseDown={() => {
            setSliding(true);
          }}
          onMouseUp={() => {
            setSliding(false);
            handleSlider();
          }}
        />
        <p>
          {actualMusicInfo.music.duration > 0
            ? getActualTime(actualMusicInfo.music.duration)
            : "0:00"}
        </p>
      </div>
      {musicRef && (
        <audio
          ref={musicRef}
          onTimeUpdate={handleProgress}
          onEnded={() => {
            setActualMusicInfo({
              ...actualMusicInfo,
              playing: false,
            });
          }}
        />
      )}
    </div>
  );
}

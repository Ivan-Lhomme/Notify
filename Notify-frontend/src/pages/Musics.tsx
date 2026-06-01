import type { MusicsProps } from "../utils/PropsType";
import styles from "../assets/css/home.module.css";
import { useState } from "react";

export default function Musics({ musics, newQueue, limit }: MusicsProps) {
  const [currentMusicUuid, setCurrentMusicUuid] = useState("");

  return (
    <div>
      <div>
        {musics.map((music, index) => {
          if (limit && index >= limit) return;

          return (
            <div
              className={styles["music"]}
              key={music.uuid}
              onMouseEnter={() => setCurrentMusicUuid(music.uuid)}
              onMouseLeave={() => setCurrentMusicUuid("")}
            >
              <p>{music.title}</p>
              {music.uuid === currentMusicUuid && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    newQueue([music]);
                  }}
                >
                  ▶️
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

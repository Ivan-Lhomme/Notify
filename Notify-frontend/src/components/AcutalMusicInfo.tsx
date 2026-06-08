import type { ActualMusicInfoProps } from "../utils/PropsType";
import styles from "../assets/css/actualMusicInfo.module.css";

export default function ActualMusicInfo({
  currentMusic,
}: ActualMusicInfoProps) {
  return (
    <div className={styles["container"]}>
      <h2>{currentMusic.title}</h2>
    </div>
  );
}

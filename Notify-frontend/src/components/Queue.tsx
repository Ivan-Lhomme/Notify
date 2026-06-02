import type { QueueProps } from "../utils/PropsType";
import styles from "../assets/css/queue.module.css";

export default function Queue({ queue, actualMusic }: QueueProps) {
  return (
    <div className={styles["queue"]}>
      {queue &&
        queue.map((music) => (
          <div
            className={
              styles[
                actualMusic && actualMusic.music === music
                  ? "currentQueueItem"
                  : "queueItem"
              ]
            }
          >
            <p>{music.title}</p>
          </div>
        ))}
    </div>
  );
}

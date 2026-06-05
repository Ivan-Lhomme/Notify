import type { QueueProps } from "../utils/PropsType";
import styles from "../assets/css/queue.module.css";

export default function Queue({ queue, actualMusic }: QueueProps) {
  return (
    <div className={styles["queue"]}>
      {queue &&
        queue.map((music, index) => (
          <div
            className={
              styles[
                actualMusic && actualMusic.music === music
                  ? "currentQueueItem"
                  : "queueItem"
              ]
            }
          >
            <p>
              <span className={styles["index"]}>{index + 1}</span> {music.title}
            </p>
          </div>
        ))}
    </div>
  );
}

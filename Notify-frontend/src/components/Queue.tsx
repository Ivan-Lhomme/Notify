import type { QueueProps } from "../utils/PropsType";

export default function Queue({ queue }: QueueProps) {
  return (
    <div>
      {queue.map((music) => (
        <p>{music.title}</p>
      ))}
    </div>
  );
}

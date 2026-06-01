import type { QueueProps } from "../utils/PropsType";

export default function Queue({ queue }: QueueProps) {
  return <div>{queue && queue.map((music) => <p>{music.title}</p>)}</div>;
}

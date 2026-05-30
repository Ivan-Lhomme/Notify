import type { PlaylistProps } from "../utils/PropsType";

export default function PlaylistInfo({ playlist, newQueue }: PlaylistProps) {
  return (
    <div>
      <h1>
        {playlist.name}
        {playlist.private && " 🔒"}
      </h1>
      <button onClick={() => newQueue(playlist.musics)}>▶️</button>
      <div>
        {playlist.musics &&
          playlist.musics.map((music) => (
            <div key={music.uuid}>
              <p>0</p>
              <p>{music.title}</p>
              <p>{music.duration}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

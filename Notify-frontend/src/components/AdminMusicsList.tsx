import type { AdminMusicsListProps } from "../utils/PropsType";

export default function AdminMusicsList({
  musics,
  deleteMusic,
}: AdminMusicsListProps) {
  return (
    <>
      <h1>Musics</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>UUID</th>
            <th>Title</th>
            <th>Publisher</th>
            <th>Explicit</th>
            <th>Play count</th>
            <th>Duration</th>
            <th>Bitrate</th>
            <th>Size</th>
            <th>Upload at</th>
          </tr>
        </thead>

        <tbody>
          {musics.length > 0 &&
            musics.map((music, index) => {
              const time = new Date(music.upload_at);

              return (
                <tr key={music.uuid}>
                  <th>{index + 1}</th>
                  <td>{music.uuid}</td>
                  <td>{music.title}</td>
                  <td>{music.explicit}</td>
                  <td>{music.plays_count}</td>
                  <td>{music.duration}</td>
                  <td>{music.bitrate}</td>
                  <td>{music.size}</td>
                  <td>
                    {time.getDate() +
                      "-" +
                      time.getMonth() +
                      "-" +
                      time.getFullYear()}
                  </td>
                  <td>
                    <button onClick={() => deleteMusic(music)}>🗑️</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

import type { AdminMusicsListProps } from "../utils/PropsType";
import styles from "../assets/css/adminMusicsList.module.css";

export default function AdminMusicsList({
  musics,
  deleteMusic,
}: AdminMusicsListProps) {
  return (
    <div className={styles["container"]}>
      <h1 className={styles["title"]}>Musics</h1>
      <table className={styles["table"]}>
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
                <tr key={music.uuid} className={styles["row"]}>
                  <th>{index + 1}</th>
                  <td>{music.uuid}</td>
                  <td>{music.title}</td>
                  <td></td>
                  <td>{music.explicit ? "Yes" : "No"}</td>
                  <td>{music.plays_count}</td>
                  {music.duration === 0 ? (
                    <td>-:--</td>
                  ) : (
                    <td>{`${Math.floor(music.duration / 60)}:${music.duration % 60}`}</td>
                  )}
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
                    <button
                      onClick={() => deleteMusic(music)}
                      className={styles["button"]}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

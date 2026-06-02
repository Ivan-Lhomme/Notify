import { useState } from "react";
import apiFetch from "../utils/apiFetch";
import type { CreatePlaylist } from "../utils/PropsType";
import styles from "../assets/css/createPlaylist.module.css";

export default function CreatePlaylist({
  resetRoute,
  playlistsFetch,
}: CreatePlaylist) {
  const [name, setName] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const createPlaylist = async () => {
    const res = await apiFetch("/api/user/createplaylist", "POST", { name });

    if (res.status != 200) {
      try {
        const body = await res.json();
        if (body.data && body.data.message) setErrMessage(body.data.message);
      } catch {
        setErrMessage("Invalid or empty playlist name");
      }

      return;
    }

    playlistsFetch();
    resetRoute();
  };

  return (
    <div>
      <div className={styles["createPlaylist"]}>
        {errMessage != "" && <p className={styles["error"]}>{errMessage}</p>}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={createPlaylist}>Create</button>
      </div>
    </div>
  );
}

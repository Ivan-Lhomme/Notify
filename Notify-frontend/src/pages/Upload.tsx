import type React from "react";
import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/upload.module.css";
import { useState } from "react";

export default function Upload() {
  const [errMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await apiFetch("/api/artist/uploadmusic", "POST", formData);

    if (!res.ok) {
      const body = await res.json();
      if (body.data && body.data.message) setErrorMessage(body.data.message);

      return;
    }

    window.location.href = "/";
  };

  return (
    <form onSubmit={handleSubmit} className={styles["uploadForm"]}>
      {errMessage !== "" && <p className={styles["error"]}>{errMessage}</p>}

      <label htmlFor="title">Title</label>
      <input type="text" name="title" id="title" />

      <label htmlFor="explicit">Is explicit</label>
      <input type="checkbox" name="explicit" id="explicit" />

      <label htmlFor="music">Music (in .ogg please)</label>
      <input type="file" name="music" id="music" />

      <button type="submit">Upload</button>
      <button onClick={() => (window.location.href = "/")}>Cancel</button>
    </form>
  );
}

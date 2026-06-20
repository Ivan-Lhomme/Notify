import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/upload.module.css";
import type { UploadProps } from "../utils/PropsType";
import { useState } from "react";

export default function YtUpload({
  loading,
  setLoading,
  errMessage,
  setErrMessage,
}: UploadProps) {
  const [musicTitle, setMusicTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (!loading) {
      setLoading(true);
      const res = await apiFetch("/api/artist/ytupload", "POST", {
        musicTitle,
        url,
      });

      if (!res.ok) {
        const body = await res.json();
        if (body.message) setErrMessage(body.message);

        setLoading(false);
        return;
      }

      window.location.href = "/";
    }
  };

  return (
    <form className={styles["uploadForm"]}>
      <h1>Youtube</h1>

      {errMessage !== "" && (
        <p className={styles["errMessage"]}>{errMessage}</p>
      )}

      <label htmlFor="musicTitle">Title</label>
      <input
        type="text"
        name="musicTitle"
        id="musicTitle"
        value={musicTitle}
        onChange={(e) => setMusicTitle(e.target.value)}
      />

      <label htmlFor="music">Enter the youtube share link</label>
      <input
        type="url"
        name="url"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleSubmit}>Upload</button>
    </form>
  );
}

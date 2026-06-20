import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/upload.module.css";
import type { UploadProps } from "../utils/PropsType";

export default function Upload({
  loading,
  setLoading,
  errMessage,
  setErrMessage,
}: UploadProps) {
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loading) {
      setLoading(true);
      const formData = new FormData(e.target);

      const res = await apiFetch("/api/artist/uploadmusic", "POST", formData);

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
    <form onSubmit={handleSubmit} className={styles["uploadForm"]}>
      <h1>File</h1>

      {errMessage !== "" && (
        <p className={styles["errMessage"]}>{errMessage}</p>
      )}

      <label htmlFor="title">Title</label>
      <input type="text" name="title" id="title" />

      <label htmlFor="explicit">Is explicit</label>
      <input type="checkbox" name="explicit" id="explicit" />

      <label htmlFor="music">Music (in .ogg only)</label>
      <input type="file" name="music" id="music" accept=".ogg" />

      <button type="submit">Upload</button>
    </form>
  );
}

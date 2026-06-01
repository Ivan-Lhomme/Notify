import type React from "react";
import apiFetch from "../utils/apiFetch";

export default function Upload() {
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    await apiFetch("/api/artist/uploadmusic", "POST", formData);
    window.location.href = "/";
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input type="text" name="title" id="title" />

      <label htmlFor="explicit">Is explicit</label>
      <input type="checkbox" name="explicit" id="explicit" />

      <label htmlFor="music">Music (in .ogg please)</label>
      <input type="file" name="music" id="music" />

      <button type="submit">Upload</button>
    </form>
  );
}

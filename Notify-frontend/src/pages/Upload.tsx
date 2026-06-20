import { useState } from "react";
import UploadComp from "../components/Upload";
import YtUpload from "../components/YtUpload";
import styles from "../assets/css/upload.module.css";

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrorMessage] = useState("");

  return (
    <>
      <button
        onClick={() => (window.location.href = "/")}
        className={styles["button"]}
      >
        Back
      </button>

      <div className={styles["container"]}>
        <UploadComp
          loading={loading}
          setLoading={setLoading}
          errMessage={errMessage}
          setErrMessage={setErrorMessage}
        />

        <div />

        <YtUpload
          loading={loading}
          setLoading={setLoading}
          errMessage={errMessage}
          setErrMessage={setErrorMessage}
        />
      </div>
    </>
  );
}

import { useState } from "react";
import UploadComp from "../components/Upload";
import YtUpload from "../components/YtUpload";
import styles from "../assets/css/upload.module.css";
import { IoMdArrowBack } from "react-icons/io";

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrorMessage] = useState("");

  return (
    <>
      <button
        onClick={() => (window.location.href = "/")}
        className={styles["button"]}
      >
        <IoMdArrowBack size={30} />
      </button>

      <div className={styles["post-container"]}>
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
      </div>
    </>
  );
}

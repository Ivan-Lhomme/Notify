import apiFetch from "../utils/apiFetch";
import type { AdminUpperBarProps } from "../utils/PropsType";
import styles from "../assets/css/adminUpperBar.module.css";
import { GoHome } from "react-icons/go";

export default function AdminUpperBar({ route, setRoute }: AdminUpperBarProps) {
  const clear2faTicket = () => apiFetch("/api/admin/clear2faticket", "GET");

  return (
    <div className={styles["container"]}>
      <button
        onClick={() => (window.location.href = "/")}
        className={styles["button"]}
      >
        <GoHome size="1.3rem" />
      </button>
      {route.musics || route.user ? (
        <button
          onClick={() =>
            setRoute((prev) => {
              return { ...prev, musics: false, user: false };
            })
          }
          className={styles["button"]}
        >
          Users
        </button>
      ) : (
        <button
          onClick={() =>
            setRoute((prev) => {
              return { ...prev, musics: true, user: false };
            })
          }
          className={styles["button"]}
        >
          Musics
        </button>
      )}
      <button onClick={clear2faTicket} className={styles["button"]}>
        Clear 2fa ticket
      </button>
    </div>
  );
}

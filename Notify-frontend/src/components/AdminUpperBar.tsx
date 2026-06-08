import apiFetch from "../utils/apiFetch";
import type { AdminUpperBarProps } from "../utils/PropsType";

export default function AdminUpperBar({ route, setRoute }: AdminUpperBarProps) {
  const clear2faTicket = () => apiFetch("/api/admin/clear2faticket", "GET");

  return (
    <>
      <button onClick={() => (window.location.href = "/")}>🏠</button>
      {route.musics || route.user ? (
        <button
          onClick={() =>
            setRoute((prev) => {
              return { ...prev, musics: false, user: false };
            })
          }
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
        >
          Musics
        </button>
      )}
      <button onClick={clear2faTicket}>Clear 2fa ticket</button>
    </>
  );
}

import { useEffect, useState } from "react";
import AdminUpperBar from "../components/AdminUpperBar";
import AdminUsers from "../components/AdminUsers";
import type { AdminPanelRoute, Music, User } from "../utils/Types";
import apiFetch from "../utils/apiFetch";
import AdminMusicsList from "../components/AdminMusicsList";
import AdminUser from "../components/AdminUser";
import styles from "../assets/css/adminPanel.module.css";

export default function AdminPanel() {
  const [route, setRoute] = useState<AdminPanelRoute>({
    musics: false,
    user: false,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [musics, setMusics] = useState<Music[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    apiFetch("/api/user/musics", "GET").then((res) =>
      res.json().then((body) => setMusics(body.data)),
    );
  }, []);

  const reloadUsers = async () => {
    const newUsers: User[] = (
      await (await apiFetch("/api/admin/users", "GET")).json()
    ).data;

    setCurrentUser((prev) => {
      const user = newUsers.find((user) => user.uuid === prev?.uuid);
      return user ? user : null;
    });

    setUsers(newUsers);
  };

  const reloadMusics = async () =>
    setMusics((await (await apiFetch("/api/user/musics", "GET")).json()).data);

  const deleteMusic = async (music: Music) => {
    const confirm = prompt(
      `Enter the user pseudo to confirm supression " ${music.title} ".`,
    );

    if (confirm === music.title) {
      await apiFetch("/api/admin/deletemusic", "POST", {
        UUID: music.uuid,
        title: music.title,
      });
      reloadMusics();

      if (currentUser) reloadUsers();
    }
  };

  return (
    <div className={styles["container"]}>
      <AdminUpperBar route={route} setRoute={setRoute} />
      {route.user && currentUser ? (
        <AdminUser user={currentUser} deleteMusic={deleteMusic} />
      ) : route.musics ? (
        <AdminMusicsList musics={musics} deleteMusic={deleteMusic} />
      ) : (
        <AdminUsers
          users={users}
          setUsers={setUsers}
          reloadUsers={reloadUsers}
          setCurrentUser={setCurrentUser}
          setRoute={setRoute}
        />
      )}
    </div>
  );
}

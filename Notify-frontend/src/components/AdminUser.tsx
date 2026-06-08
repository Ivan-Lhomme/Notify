import type { AdminUserProps } from "../utils/PropsType";
import AdminMusicsList from "./AdminMusicsList";
import styles from "../assets/css/adminUser.module.css";

export default function AdminUser({ user, deleteMusic }: AdminUserProps) {
  console.log(user);
  return (
    <div className={styles["container"]}>
      <h1 className={styles["username"]}>{user.pseudo}</h1>
      {user.musics ? (
        <AdminMusicsList musics={user.musics} deleteMusic={deleteMusic} />
      ) : (
        <p>No music upload</p>
      )}
    </div>
  );
}

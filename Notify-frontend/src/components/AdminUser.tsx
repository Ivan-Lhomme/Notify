import type { AdminUserProps } from "../utils/PropsType";
import AdminMusicsList from "./AdminMusicsList";

export default function AdminUser({ user, deleteMusic }: AdminUserProps) {
  console.log(user);
  return (
    <>
      <h1>{user.pseudo}</h1>
      {user.musics ? (
        <AdminMusicsList musics={user.musics} deleteMusic={deleteMusic} />
      ) : (
        <p>No music upload</p>
      )}
    </>
  );
}

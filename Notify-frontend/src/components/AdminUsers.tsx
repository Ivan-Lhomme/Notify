import { useEffect, useState } from "react";
import apiFetch from "../utils/apiFetch";
import type { User } from "../utils/Types";
import type { AdminUsersProps } from "../utils/PropsType";
import styles from "../assets/css/adminUsers.module.css";

type UserNewRole = {
  uuid: string;
  role: number;
};

export default function AdminUsers({
  users,
  setUsers,
  reloadUsers,
  setCurrentUser,
  setRoute,
}: AdminUsersProps) {
  const [usersNewRole, setUsersNewRole] = useState<UserNewRole[]>([]);

  useEffect(() => {
    apiFetch("/api/admin/users", "GET").then((res) => {
      res.json().then((body) => setUsers(body.data));
    });
  }, []);

  const getRole = (roleNumber: number): string =>
    roleNumber === 1 ? "Admin" : roleNumber === 2 ? "Artist" : "User";

  const deleteUser = async (user: User) => {
    const confirm = prompt(
      `Enter the user pseudo to confirm supression " ${user.pseudo} ".`,
    );

    if (confirm === user.pseudo) {
      await apiFetch("/api/admin/deleteuser", "POST", { UUID: user.uuid });
      reloadUsers();
    }
  };

  const modifyUserRole = async (user: User) => {
    const newRole = usersNewRole.find(
      (userNewRole) => userNewRole.uuid === user.uuid,
    );

    if (!newRole) return;

    setUsersNewRole((prev) =>
      prev.filter((userNewRole) => userNewRole.uuid !== user.uuid),
    );

    await apiFetch("/api/admin/modifyuser", "POST", {
      UUID: newRole.uuid,
      role: newRole.role,
    });
    reloadUsers();
  };

  const handleRoleClick = (user: User) => {
    setUsersNewRole((prev) => [...prev, { uuid: user.uuid, role: user.role }]);
  };

  const handleRoleSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    userUuid: string,
  ) => {
    const role = Number.parseInt(e.target.value);

    setUsersNewRole((prev) =>
      prev.map((userNewRole) =>
        userNewRole.uuid === userUuid ? { ...userNewRole, role } : userNewRole,
      ),
    );
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    setRoute((prev) => {
      return {
        ...prev,
        musics: false,
        user: true,
      };
    });
  };

  return (
    <div className={styles["container"]}>
      <h1 className={styles["title"]}>Users</h1>
      <table className={styles["table"]}>
        <thead>
          <tr>
            <th></th>
            <th>UUID</th>
            <th>Pseudo</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created at</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 &&
            users.map((user, index) => {
              const time = new Date(user.created_at);
              const newRole = usersNewRole.find(
                (userNewRole) => userNewRole.uuid === user.uuid,
              );

              return (
                <tr
                  key={user.uuid}
                  onClick={() => handleUserSelect(user)}
                  className={styles["row"]}
                >
                  <th>{index + 1}</th>
                  <td>{user.uuid}</td>
                  <td>{user.pseudo}</td>
                  <td>{user.email}</td>
                  {newRole ? (
                    <td>
                      <select
                        value={newRole.role}
                        name="role"
                        id="role"
                        onChange={(e) => handleRoleSelect(e, user.uuid)}
                      >
                        <option value={1}>Admin</option>
                        <option value={2}>Artist</option>
                        <option value={3}>User</option>
                      </select>
                    </td>
                  ) : (
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleClick(user);
                      }}
                    >
                      {getRole(user.role)}
                    </td>
                  )}
                  <td>
                    {time.getDate() +
                      "-" +
                      time.getMonth() +
                      "-" +
                      time.getFullYear()}
                  </td>
                  <td className={styles["buttons-wrapper"]}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(user);
                      }}
                      className={styles["button"]}
                    >
                      🗑️
                    </button>
                    {newRole && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          modifyUserRole(user);
                        }}
                        className={styles["button"]}
                      >
                        Modify
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

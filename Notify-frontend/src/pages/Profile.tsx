import { useState } from "react";
import apiFetch from "../utils/apiFetch";
import styles from "../assets/css/profile.module.css";

type data = {
  start: boolean;
  user: any;
};

export default function Profile() {
  const [data, setData] = useState<data>({
    start: true,
    user: undefined,
  });

  const logout = async () => {
    await apiFetch("/logout", "GET");
    window.location.reload();
  };
  const requestData = async () => {
    const response = await apiFetch("/api/user/profile", "GET");

    setData({
      start: false,
      user: (await response.json()).data,
    });
  };

  if (data.start) requestData();

  if (data.user === undefined) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles["profile"]}>
        <h1>{data.user.pseudo}</h1>
        <h2>{data.user.email}</h2>
        <p>
          {data.user.role === 1
            ? "Admin"
            : data.user.role === 2
              ? "Artist"
              : "User"}
        </p>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

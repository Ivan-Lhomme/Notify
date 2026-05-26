import { useState, type ChangeEvent } from "react";
import styles from "../assets/css/login.module.css";
import apiFetch from "../utils/apiFetch";

export default function PreLogin({
  setTicket,
}: {
  setTicket: React.Dispatch<
    React.SetStateAction<{
      uuid: string;
      email: string;
      code: string;
      valid: boolean;
    }>
  >;
}) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errMessage, setErrMessage] = useState("");

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      email: e.target.value,
    });
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      password: e.target.value,
    });
  };

  const preLogin = async () => {
    const res = await apiFetch("/auth/login", "POST", user);

    const body = await res.json();

    if (body.message) {
      setErrMessage(body.message);
    } else {
      const data = body.data;

      if (data) {
        setTicket({
          uuid: data.uuid,
          email: data.email,
          code: "",
          valid: true,
        });
      }
    }
  };

  return (
    <>
      <div className={styles["form"]}>
        {errMessage != "" && (
          <p className={styles["errMessage"]}>{errMessage}</p>
        )}

        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" onChange={handleEmail} />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handlePassword}
        />

        <button onClick={preLogin}>Login</button>
      </div>
    </>
  );
}

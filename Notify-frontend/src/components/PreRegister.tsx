import { useState, type ChangeEvent } from "react";
import styles from "../assets/css/login.module.css";
import apiFetch from "../utils/apiFetch";
import type { PreRegisterProps } from "../utils/PropsType";

export default function PreRegister({ setTicket }: PreRegisterProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    pseudo: "",
    email: "",
    password: "",
  });
  const [errMessage, setErrMessage] = useState("");

  const handlePseudo = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      pseudo: e.target.value,
    });
  };
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

  const preRegister = async () => {
    setLoading(true);
    const res = await apiFetch("/auth/preregister", "POST", user);

    const body = await res.json();

    if (body.message) {
      setErrMessage(body.message);
      setLoading(false);
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

        <label htmlFor="pseudo">Pseudo</label>
        <input type="text" name="pseudo" id="pseudo" onChange={handlePseudo} />

        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" onChange={handleEmail} />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handlePassword}
        />

        {loading ? (
          <button>Register</button>
        ) : (
          <button onClick={preRegister}>Register</button>
        )}
      </div>

      <button
        className={styles["Button"]}
        onClick={() => (window.location.href = "/login")}
      >
        Already have an account ?
      </button>
    </>
  );
}

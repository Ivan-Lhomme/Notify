import { useState, type ChangeEvent } from "react";
import styles from "../assets/css/login.module.css";
import apiFetch from "../utils/apiFetch";
import type { RegisterProps } from "../utils/PropsType";

export default function Register({ ticket, setTicket }: RegisterProps) {
  if (ticket.uuid === undefined || ticket.email === undefined) {
    setTicket({
      ...ticket,
      valid: false,
    });
  }

  const [code, setCode] = useState("");

  const handleCode = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const sendCode = async () => {
    if (code != "" && code.length == 6) {
      let newTicket = {
        ...ticket,
        code: code,
        valid: true,
      };

      const res = await apiFetch("/auth/register", "POST", newTicket);

      if (res.status === 400) {
        newTicket = {
          ...newTicket,
          valid: false,
        };

        setTicket(newTicket);
        return;
      }

      window.location.href = "/";
    }
  };

  return (
    <div className={styles["form"]}>
      <label htmlFor="code">Enter the code</label>
      <input
        type="text"
        name="code"
        id="code"
        onChange={handleCode}
        maxLength={6}
      />

      <button onClick={sendCode}>Login</button>
    </div>
  );
}

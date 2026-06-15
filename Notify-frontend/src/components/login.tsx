import { useState, type ChangeEvent } from "react";
import styles from "../assets/css/login.module.css";
import apiFetch from "../utils/apiFetch";

export default function Login({
  ticket,
  setTicket,
}: {
  ticket: {
    uuid: string;
    email: string;
    code: string;
    valid: boolean;
  };
  setTicket: React.Dispatch<
    React.SetStateAction<{
      uuid: string;
      email: string;
      code: string;
      valid: boolean;
    }>
  >;
}) {
  if (ticket.uuid === undefined || ticket.email === undefined) {
    setTicket({
      ...ticket,
      valid: false,
    });
  }

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [numberOfSend, setNumberOfSend] = useState(0);

  const handleCode = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const sendCode = async () => {
    if (code != "" && code.length == 6) {
      setLoading(true);

      let newTicket = {
        ...ticket,
        code: code,
        valid: true,
      };

      const res = await apiFetch("/auth/login", "POST", newTicket);

      if (res.status === 400 && numberOfSend < 1) {
        setNumberOfSend((prev) => prev + 1);
        setLoading(false);
        return;
      }

      if (res.ok) window.location.href = "/";
      else window.location.href = "/login";
    }
  };

  return (
    <div className={styles["form"]}>
      {numberOfSend > 0 && (
        <p className={styles["errMessage"]}>Wrong code, 1 more try left</p>
      )}
      <label htmlFor="code">Enter the code</label>
      <input
        type="text"
        name="code"
        id="code"
        onChange={handleCode}
        maxLength={6}
      />

      {loading ? (
        <button>Login</button>
      ) : (
        <button onClick={sendCode}>Login</button>
      )}
    </div>
  );
}

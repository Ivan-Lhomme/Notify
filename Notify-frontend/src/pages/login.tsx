import { useState } from "react";
import Prelogin from "../components/prelogin";
import Login from "../components/login";

export default function LoginPage() {
  const [ticket, setTicket] = useState({
    uuid: "",
    email: "",
    code: "",
    valid: false,
  });

  return ticket.valid ? (
    <Login ticket={ticket} setTicket={setTicket} />
  ) : (
    <Prelogin setTicket={setTicket} />
  );
}

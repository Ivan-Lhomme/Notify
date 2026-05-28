import { useState } from "react";
import Prelogin from "../components/prelogin";
import Login from "../components/login";
import type { Ticket2fa } from "../utils/Types";

export default function LoginPage() {
  const [ticket, setTicket] = useState<Ticket2fa>({
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

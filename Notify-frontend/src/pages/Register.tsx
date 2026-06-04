import { useState } from "react";
import type { Ticket2fa } from "../utils/Types";
import PreRegister from "../components/PreRegister";
import Register from "../components/Register";

export default function RegisterPage() {
  const [ticket, setTicket] = useState<Ticket2fa>({
    uuid: "",
    email: "",
    code: "",
    valid: false,
  });

  return ticket.valid ? (
    <Register ticket={ticket} setTicket={setTicket} />
  ) : (
    <PreRegister setTicket={setTicket} />
  );
}

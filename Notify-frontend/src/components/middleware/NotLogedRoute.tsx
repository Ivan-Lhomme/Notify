import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";
import apiFetch from "../../utils/apiFetch";

export default function NotLogedRoute({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<Boolean | null>(null);

  useEffect(() => {
    apiFetch("/refresh", "GET").finally(() => {
      apiFetch(`/auth`, "GET").then((res) => setIsAuth(res.status === 403));
    });
  }, []);

  if (isAuth === null) return <p>Loading...</p>;
  if (isAuth) return <Navigate to="/" />;

  return children;
}

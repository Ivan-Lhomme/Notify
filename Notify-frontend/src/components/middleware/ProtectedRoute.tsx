import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";
import apiFetch from "../../utils/apiFetch";

export default function ProtectedRoute({
  reqAuth,
  children,
}: {
  reqAuth: string;
  children: ReactNode;
}) {
  const [isAuth, setIsAuth]: [Boolean | null, Function] = useState(null);

  useEffect(() => {
    apiFetch(`/api/${reqAuth}`, "GET").then((res) =>
      setIsAuth(res.status === 404),
    );
  }, []);

  if (isAuth === null) return <p>Loading...</p>;
  if (!isAuth) return <Navigate to="/login" />;

  return children;
}

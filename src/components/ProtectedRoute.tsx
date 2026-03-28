// Redirige al login si el usuario no está autenticado.
// Muestra nada mientras se verifica la sesión inicial.

import { Navigate } from "react-router-dom";
import { useAuth }  from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated
    ? <>{children}</>
    : <Navigate to="/login" replace />;
}
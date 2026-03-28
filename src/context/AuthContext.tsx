// Contexto global de autenticación.
// Provee: usuario, token, login(), logout(), isAuthenticated
// Cualquier componente puede consumirlo con useAuth()

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import client from "../api/client";

interface AuthContextType {
  usuario:         string | null;
  token:           string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  login:           (usuario: string, password: string) => Promise<void>;
  logout:          () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar, restaurar sesión desde localStorage si existe
  useEffect(() => {
    const savedToken   = localStorage.getItem("autobot_token");
    const savedUsuario = localStorage.getItem("autobot_usuario");
    if (savedToken && savedUsuario) {
      setToken(savedToken);
      setUsuario(savedUsuario);
    }
    setIsLoading(false);
  }, []);

  const login = async (usuario: string, password: string) => {
    // POST /api/login — el backend verifica contra la plataforma
    const { data } = await client.post("/api/login", { usuario, password });

    // Guardar token y usuario en localStorage para persistir entre recargas
    // La contraseña NUNCA se guarda
    localStorage.setItem("autobot_token",   data.token);
    localStorage.setItem("autobot_usuario", data.usuario);

    setToken(data.token);
    setUsuario(data.usuario);
  };

  const logout = () => {
    localStorage.removeItem("autobot_token");
    localStorage.removeItem("autobot_usuario");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
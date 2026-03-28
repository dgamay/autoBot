// Página de login — respeta la paleta de Honor UP's
// Azul primario #1a4fa0, banda oscura #163d7d

import { useState,  type FormEvent } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";

export default function LoginPage() {
  const { login }        = useAuth();
  const navigate         = useNavigate();
  const [usuario,  setUsuario]  = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await login(usuario, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        "No se pudo conectar con el servidor"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight:       "100vh",
      background:      "#f0f2f5",
      display:         "flex",
      flexDirection:   "column",
      alignItems:      "center",
    }}>

      {/* Header igual al original */}
      <div style={{
        width:      "100%",
        background: "#1a4fa0",
        padding:    "0",
      }}>
        <div style={{
          maxWidth:   "520px",
          margin:     "0 auto",
          padding:    "14px 24px",
          display:    "flex",
          alignItems: "center",
          gap:        "16px",
        }}>
          {/* Logo Honor */}
          <div style={{
            background:   "#fff",
            borderRadius: "6px",
            padding:      "6px 12px",
            fontWeight:   "bold",
            fontSize:     "20px",
            color:        "#1a4fa0",
            letterSpacing: "1px",
          }}>
            HONOR
          </div>
          <div style={{
            width:      "1px",
            height:     "36px",
            background: "rgba(255,255,255,0.4)",
          }} />
          <span style={{
            color:      "#fff",
            fontSize:   "22px",
            fontWeight: 300,
            letterSpacing: "2px",
          }}>
            UP's
          </span>
        </div>
        {/* Banda azul oscura */}
        <div style={{
          background: "#163d7d",
          height:     "6px",
          width:      "100%",
        }} />
      </div>

      {/* Formulario */}
      <div style={{
        background:   "#fff",
        marginTop:    "40px",
        width:        "100%",
        maxWidth:     "480px",
        borderRadius: "8px",
        boxShadow:    "0 2px 12px rgba(0,0,0,0.1)",
        overflow:     "hidden",
      }}>
        {/* Título */}
        <div style={{
          borderBottom: "1px solid #e0e0e0",
          padding:      "20px 28px 16px",
        }}>
          <h2 style={{
            margin:     0,
            fontSize:   "20px",
            fontWeight: 600,
            color:      "#1a1a1a",
          }}>
            Ingresar
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px" }}>
          <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#444" }}>
            Por favor ingrese sus datos de acceso:
          </p>
          <p style={{
            margin:     "0 0 20px",
            fontSize:   "12px",
            fontStyle:  "italic",
            color:      "#666",
          }}>
            Campos con <span style={{ color: "#cc0000" }}>*</span> son requeridos.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background:   "#fce8e6",
              border:       "1px solid #f5c6c2",
              borderRadius: "6px",
              padding:      "10px 14px",
              marginBottom: "16px",
              fontSize:     "13px",
              color:        "#c62828",
            }}>
              {error}
            </div>
          )}

          {/* Campo usuario */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}htmlFor="usuario">
              Usuario <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
              autoComplete="username"
              style={inputStyle}
            />
          </div>

          {/* Campo contraseña */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}htmlFor="password">
              Contraseña <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={cargando}
            style={{
              background:    cargando ? "#7a9fd4" : "#1a4fa0",
              color:         "#fff",
              border:        "none",
              borderRadius:  "5px",
              padding:       "9px 24px",
              fontSize:      "14px",
              fontWeight:    500,
              cursor:        cargando ? "not-allowed" : "pointer",
              transition:    "background 0.2s",
            }}
          >
            {cargando ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{
        marginTop: "24px",
        fontSize:  "11px",
        color:     "#999",
      }}>
        AutoBot v1.0 — Honor Servicios de Seguridad
      </p>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display:      "block",
  marginBottom: "6px",
  fontSize:     "13px",
  fontWeight:   500,
  color:        "#333",
};

const inputStyle: React.CSSProperties = {
  width:        "100%",
  padding:      "8px 10px",
  border:       "1px solid #ccc",
  borderRadius: "4px",
  fontSize:     "14px",
  boxSizing:    "border-box",
  outline:      "none",
  transition:   "border-color 0.2s",
};
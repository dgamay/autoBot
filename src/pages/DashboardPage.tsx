// Pantalla principal — subir Excel, ver progreso en vivo y descargar resultados

import { useState, useRef, type ChangeEvent } from "react";
import { useAuth }       from "../context/AuthContext";
import { useSSE }        from "../hooks/useSSE";
import { ProgressBar }   from "../components/ProgressBar";
import { ProgressTable } from "../components/ProgressTable";
import client            from "../api/client";

export default function DashboardPage() {
  const { usuario, logout }     = useAuth();
  const [archivo,  setArchivo]  = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [jobId,    setJobId]    = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook SSE: se activa cuando jobId tiene valor
  const { filas, finalizado, excelUrl, zipUrl, estado } = useSSE(jobId);

  // Porcentaje calculado desde la última fila recibida
  const porcentaje = filas.length > 0
    ? (filas[filas.length - 1].porcentaje ?? 0)
    : 0;
  const total = filas.length > 0
    ? (filas[filas.length - 1].total ?? 0)
    : 0;

  const handleArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setArchivo(f);
    setError(null);
  };

  const handleEnviar = async () => {
    if (!archivo)   return setError("Selecciona un archivo Excel primero");
    if (!password)  return setError("Ingresa tu contraseña para continuar");

    setError(null);
    setEnviando(true);
    setJobId(null);

    try {
      // FormData lleva: el archivo + la contraseña
      // La contraseña se usa una sola vez y no se persiste en ningún lado
      const form = new FormData();
      form.append("excel",    archivo);
      form.append("password", password);

      const { data } = await client.post("/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setJobId(data.jobId);
      setPassword(""); // limpiar inmediatamente — ya cumplió su función
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        "Error al enviar el archivo"
      );
    } finally {
      setEnviando(false);
    }
  };

  const handleNuevoProceso = () => {
    setJobId(null);
    setArchivo(null);
    setPassword("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const corriendo = estado === "corriendo" || estado === "conectando";

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "#1a4fa0" }}>
        <div style={{
          maxWidth:       "900px",
          margin:         "0 auto",
          padding:        "12px 24px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              background:   "#fff",
              borderRadius: "6px",
              padding:      "5px 10px",
              fontWeight:   "bold",
              fontSize:     "18px",
              color:        "#1a4fa0",
            }}>
              HONOR
            </div>
            <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.4)" }} />
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: 300, letterSpacing: "2px" }}>
              UP's — AutoBot
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
              {usuario}
            </span>
            <button
              onClick={logout}
              style={{
                background:   "rgba(255,255,255,0.15)",
                color:        "#fff",
                border:       "1px solid rgba(255,255,255,0.3)",
                borderRadius: "4px",
                padding:      "5px 14px",
                fontSize:     "12px",
                cursor:       "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <div style={{ background: "#163d7d", height: "5px" }} />
      </div>

      {/* Contenido */}
      <div style={{
        maxWidth: "900px",
        margin:   "32px auto",
        width:    "100%",
        padding:  "0 16px",
      }}>

        {/* Panel de carga */}
        <div style={{
          background:   "#fff",
          borderRadius: "8px",
          boxShadow:    "0 2px 12px rgba(0,0,0,0.08)",
          padding:      "28px",
          marginBottom: "24px",
        }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "16px", color: "#1a4fa0", fontWeight: 600 }}>
            Cargar archivo Excel
          </h3>

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

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>

            {/* Selector de archivo */}
            <div style={{ flex: "2", minWidth: "200px" }}>
              <label style={labelStyle} htmlFor="Archivo Excel">
                Archivo Excel <span style={{ color: "#cc0000" }}>*</span>
              </label>
              <input
                id="Archivo Excel"
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleArchivo}
                disabled={corriendo}
                style={{
                  width:     "100%",
                  padding:   "7px 10px",
                  border:    "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize:  "13px",
                  boxSizing: "border-box",
                  background: corriendo ? "#f5f5f5" : "#fff",
                }}
              />
            </div>

            {/* Contraseña */}
            <div style={{ flex: "1", minWidth: "160px" }}>
              <label style={labelStyle}>
                Contraseña <span style={{ color: "#cc0000" }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                disabled={corriendo}
                autoComplete="current-password"
                style={{
                  width:        "100%",
                  padding:      "8px 10px",
                  border:       "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize:     "13px",
                  boxSizing:    "border-box",
                  background:   corriendo ? "#f5f5f5" : "#fff",
                }}
              />
            </div>

            {/* Botón iniciar */}
            <div>
              <button
                onClick={handleEnviar}
                disabled={corriendo || enviando}
                style={{
                  background:   corriendo || enviando ? "#7a9fd4" : "#1a4fa0",
                  color:        "#fff",
                  border:       "none",
                  borderRadius: "5px",
                  padding:      "9px 24px",
                  fontSize:     "14px",
                  fontWeight:   500,
                  cursor:       corriendo || enviando ? "not-allowed" : "pointer",
                  whiteSpace:   "nowrap",
                }}
              >
                {enviando ? "Enviando..." : corriendo ? "Procesando..." : "Iniciar proceso"}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de progreso — aparece cuando hay jobId */}
        {jobId && (
          <div style={{
            background:   "#fff",
            borderRadius: "8px",
            boxShadow:    "0 2px 12px rgba(0,0,0,0.08)",
            padding:      "28px",
          }}>
            <div style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              marginBottom:   "20px",
            }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#1a4fa0", fontWeight: 600 }}>
                Progreso del proceso
              </h3>
              {finalizado && (
                <span style={{
                  background:   estado === "done" ? "#e6f4ea" : "#fce8e6",
                  color:        estado === "done" ? "#1e7e34" : "#c62828",
                  padding:      "4px 14px",
                  borderRadius: "12px",
                  fontSize:     "12px",
                  fontWeight:   500,
                }}>
                  {estado === "done" ? "✓ Completado" : "✗ Error"}
                </span>
              )}
            </div>

            {/* Barra de progreso */}
            {total > 0 && (
              <ProgressBar
                porcentaje={porcentaje}
                total={total}
                procesadas={filas.length}
              />
            )}

            {/* Botones de descarga */}

            {finalizado && (excelUrl || zipUrl) && (
              <div style={{ display: "flex", gap: "12px", margin: "16px 0" }}>
                {excelUrl && (
                  
                <a href={excelUrl}
                    download="reporte.xlsx"
                    style={{
                     backgroundColor:   "#1a4fa0",
                      color:        "#fff",
                      padding:      "8px 20px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      fontSize:     "13px",
                      fontWeight:   500,
                    }}
                  >
                    Descargar reporte Excel
                  </a>
                )}
                {zipUrl && (
                  
                    <a href={zipUrl}
                    download="screenshots.zip"
                    style={{
                      background:   "#fff",
                      color:        "#1a4fa0",
                      border:       "1px solid #1a4fa0",
                      padding:      "8px 20px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      fontSize:     "13px",
                      fontWeight:   500,
                    }}
                  >
                    Descargar screenshots
                  </a>
                )}
                <button
                  onClick={handleNuevoProceso}
                  style={{
                    background:   "#f0f2f5",
                    color:        "#555",
                    border:       "1px solid #ddd",
                    borderRadius: "5px",
                    padding:      "8px 20px",
                    fontSize:     "13px",
                    cursor:       "pointer",
                  }}
                >
                  Nuevo proceso
                </button>
              </div>
            )}

            {/* Tabla de resultados */}
            <ProgressTable filas={filas} />
          </div>
        )}
      </div>
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
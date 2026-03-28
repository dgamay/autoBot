// Tabla de resultados en tiempo real.
// Cada fila se colorea según el resultado del bot.

import {  type ProgresoFila } from "../hooks/useSSE";

const COLORES: Record<string, { bg: string; color: string }> = {
  "CREADO":                       { bg: "#e6f4ea", color: "#1e7e34" },
  "ACTUALIZADO":                  { bg: "#e8f0fe", color: "#1a4fa0" },
  "DUPLICADO GESTIONADO":         { bg: "#fff3cd", color: "#856404" },
  "SIN CAMBIOS - ABONADO DIFERENTE": { bg: "#fce8e6", color: "#c62828" },
};

function obtenerColor(resultado: string) {
  for (const clave of Object.keys(COLORES)) {
    if (resultado.startsWith(clave)) return COLORES[clave];
  }
  if (resultado.startsWith("ERROR")) return { bg: "#fce8e6", color: "#c62828" };
  return { bg: "#f5f5f5", color: "#333" };
}

interface Props {
  filas: ProgresoFila[];
}

export function ProgressTable({ filas }: Props) {
  if (filas.length === 0) return null;

  return (
    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
      <table style={{
        width:          "100%",
        borderCollapse: "collapse",
        fontSize:       "13px",
      }}>
        <thead>
          <tr style={{ background: "#1a4fa0", color: "#fff" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Sitio</th>
            <th style={thStyle}>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => {
            const { bg, color } = obtenerColor(f.resultado);
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td style={tdStyle}>{f.fila}</td>
                <td style={tdStyle}>{f.sitio}</td>
                <td style={tdStyle}>
                  <span style={{
                    background:   bg,
                    color,
                    padding:      "2px 10px",
                    borderRadius: "12px",
                    fontWeight:   500,
                    fontSize:     "12px",
                  }}>
                    {f.resultado}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding:   "10px 14px",
  textAlign: "left",
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding:     "8px 14px",
  borderBottom: "1px solid #eee",
};
// Barra de progreso visual con porcentaje.

interface Props {
  porcentaje: number;
  total:      number;
  procesadas: number;
}

export function ProgressBar({ porcentaje, total, procesadas }: Props) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        marginBottom:   "6px",
        fontSize:       "13px",
        color:          "#555",
      }}>
        <span>Procesando filas...</span>
        <span>{procesadas} / {total} — {porcentaje}%</span>
      </div>
      <div style={{
        width:        "100%",
        height:       "10px",
        background:   "#dde3ee",
        borderRadius: "6px",
        overflow:     "hidden",
      }}>
        <div style={{
          width:        `${porcentaje}%`,
          height:       "100%",
          background:   "linear-gradient(90deg, #1a4fa0, #2e6fd4)",
          borderRadius: "6px",
          transition:   "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}
// Hook que abre una conexión SSE con el backend para recibir
// el progreso del bot en tiempo real fila por fila.
// Se desconecta automáticamente al desmontar o cuando el job termina.

import { useEffect, useRef, useState } from "react";

export interface ProgresoFila {
  fila:       number;
  sitio:      string;
  resultado:  string;
  total?:     number;
  porcentaje?: number;
}

interface UseSSEResult {
  filas:      ProgresoFila[];
  finalizado: boolean;
  excelUrl:   string | null;
  zipUrl:     string | null;
  estado:     "idle" | "conectando" | "corriendo" | "done" | "error";
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useSSE(jobId: string | null): UseSSEResult {
  const [filas,      setFilas]      = useState<ProgresoFila[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [excelUrl,   setExcelUrl]   = useState<string | null>(null);
  const [zipUrl,     setZipUrl]     = useState<string | null>(null);
  const [estado,     setEstado]     = useState<UseSSEResult["estado"]>("idle");
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const token = localStorage.getItem("autobot_token");
    if (!token) return;

    setEstado("conectando");
    setFilas([]);
    setFinalizado(false);

    // SSE no soporta headers nativamente — se pasa el token como query param
    // El backend lo acepta como alternativa al header Authorization
    const url = `${API_URL}/api/status/${jobId}?token=${token}`;
    const es  = new EventSource(url);
    esRef.current = es;

    es.addEventListener("progreso", (e: MessageEvent) => {
      const datos: ProgresoFila = JSON.parse(e.data);
      setEstado("corriendo");
      setFilas(prev => [...prev, datos]);
    });

    es.addEventListener("fin", (e: MessageEvent) => {
      const datos = JSON.parse(e.data);
      setFinalizado(true);
      setEstado(datos.status === "done" ? "done" : "error");
      if (datos.excelUrl) setExcelUrl(`${API_URL}${datos.excelUrl}`);
      if (datos.zipUrl)   setZipUrl(`${API_URL}${datos.zipUrl}`);
      es.close();
    });

    es.onerror = () => {
      setEstado("error");
      es.close();
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [jobId]);

  return { filas, finalizado, excelUrl, zipUrl, estado };
}
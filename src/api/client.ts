import axios from "axios";

/**
 * URL del backend real — mismo backend que usa el Experience OS interno.
 * En desarrollo apunta a localhost:8000; en producción se define con
 * VITE_API_URL. El cliente agrega automáticamente /api/v1 para consumir el
 * contrato estable del portal.
 */
const URL_BASE = import.meta.env.VITE_API_URL;

if (!URL_BASE && import.meta.env.PROD) {
  throw new Error(
    "VITE_API_URL no está configurada — el portal no puede arrancar en producción sin saber a qué backend conectarse."
  );
}

function conApiV1(base: string): string {
  const normalizada = base.replace(/\/+$/, "");
  return normalizada.endsWith("/api/v1") ? normalizada : `${normalizada}/api/v1`;
}

export const apiClient = axios.create({
  baseURL: conApiV1(URL_BASE || "http://localhost:8000"),
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

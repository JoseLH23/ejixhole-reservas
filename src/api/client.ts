import axios from "axios";

import { obtenerPublicClientId } from "@/lib/publicClientId";

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

apiClient.interceptors.request.use((config) => {
  const ruta = config.url ?? "";
  if (ruta.includes("/publico/form-challenge") || ruta.includes("/publico/reservaciones")) {
    config.headers.set("X-Public-Client", obtenerPublicClientId());
  }
  return config;
});

import axios from "axios";

/**
 * URL del backend real — mismo backend que usa el Experience OS
 * interno. En desarrollo apunta a localhost:8000; en producción se
 * define con la variable de entorno VITE_API_URL al hacer el build.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

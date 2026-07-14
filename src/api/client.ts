import axios from "axios";

/**
 * URL del backend real — mismo backend que usa el Experience OS
 * interno. En desarrollo apunta a localhost:8000; en producción se
 * define con la variable de entorno VITE_API_URL al hacer el build.
 *
 * ME-15 (auditoría de seguridad 13/jul/2026): antes, si faltaba
 * VITE_API_URL en un build de producción, el sitio apuntaba en
 * silencio a localhost:8000 — el portal público quedaba
 * completamente roto sin ningún error claro de por qué. Ahora falla
 * fuerte al cargar la app en producción si falta, en vez de fallar
 * tarde y en silencio cuando alguien intenta reservar.
 */
const URL_BASE = import.meta.env.VITE_API_URL;

if (!URL_BASE && import.meta.env.PROD) {
  throw new Error(
    "VITE_API_URL no está configurada — el portal no puede arrancar en producción sin saber a qué backend conectarse."
  );
}

export const apiClient = axios.create({
  baseURL: URL_BASE || "http://localhost:8000", // el fallback solo aplica en desarrollo local
  headers: { "Content-Type": "application/json" },
  // ME-07 (auditoría de seguridad 13/jul/2026): sin timeout, una
  // cotización o reserva podía quedar "pendiente" indefinidamente en
  // el navegador del visitante — llevando a reenvíos y duplicados.
  timeout: 15_000,
});

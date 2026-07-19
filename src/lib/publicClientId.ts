const STORAGE_KEY = "ejixhole_public_client_id";

function nuevoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `public-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function obtenerPublicClientId(): string {
  if (typeof window === "undefined") return "server-render";
  const existente = window.sessionStorage.getItem(STORAGE_KEY);
  if (existente) return existente;
  const creado = nuevoId();
  window.sessionStorage.setItem(STORAGE_KEY, creado);
  return creado;
}

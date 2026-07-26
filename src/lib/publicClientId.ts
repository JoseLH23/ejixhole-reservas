const STORAGE_KEY = "ejixhole_public_client_id";
let idEnMemoria: string | null = null;

function nuevoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `public-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function obtenerPublicClientId(): string {
  if (idEnMemoria) return idEnMemoria;
  if (typeof window === "undefined") {
    idEnMemoria = "server-render";
    return idEnMemoria;
  }

  try {
    const existente = window.sessionStorage.getItem(STORAGE_KEY);
    if (existente) {
      idEnMemoria = existente;
      return existente;
    }
    idEnMemoria = nuevoId();
    window.sessionStorage.setItem(STORAGE_KEY, idEnMemoria);
    return idEnMemoria;
  } catch {
    idEnMemoria = nuevoId();
    return idEnMemoria;
  }
}

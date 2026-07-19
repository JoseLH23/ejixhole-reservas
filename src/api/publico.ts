import { apiClient } from "./client";
import {
  confirmarFormularioSeguro,
  precargarFormularioSeguro,
  prepararFormularioSeguro,
} from "@/lib/formularioSeguro";
import { obtenerPublicClientId } from "@/lib/publicClientId";
import type {
  CotizacionResponse,
  DisponibilidadResponse,
  FechaBloqueadaPublica,
  PeriodoNoDisponible,
  ReservacionPublicaCreate,
  ReservacionPublicaResponse,
  ServicioPublico,
  TipoReservacion,
  UnidadHospedajePublico,
} from "@/types/publico";

precargarFormularioSeguro();

export const publicoApi = {
  getServicios: async (): Promise<ServicioPublico[]> => {
    const { data } = await apiClient.get("/publico/servicios");
    return data;
  },

  getUnidadesHospedaje: async (): Promise<UnidadHospedajePublico[]> => {
    const { data } = await apiClient.get("/publico/unidades-hospedaje");
    return data;
  },

  getFechasBloqueadas: async (params: { desde: string; hasta: string }): Promise<FechaBloqueadaPublica[]> => {
    const { data } = await apiClient.get("/publico/fechas-bloqueadas", { params });
    return data;
  },

  getDisponibilidadCalendario: async (params: {
    unidad_hospedaje_id: number;
    desde: string;
    hasta: string;
  }): Promise<PeriodoNoDisponible[]> => {
    const { data } = await apiClient.get("/publico/disponibilidad-calendario", { params });
    return data;
  },

  getDisponibilidad: async (params: {
    unidad_hospedaje_id: number;
    fecha_llegada: string;
    fecha_salida: string;
  }): Promise<DisponibilidadResponse> => {
    const { data } = await apiClient.get("/publico/disponibilidad", { params });
    return data;
  },

  cotizar: async (params: {
    tipo_reservacion: TipoReservacion;
    fecha_llegada: string;
    fecha_salida: string;
    num_personas: number;
    unidad_hospedaje_id?: number | null;
  }): Promise<CotizacionResponse> => {
    const { data } = await apiClient.get("/publico/cotizar", { params });
    return data;
  },

  crearReservacion: async (payload: ReservacionPublicaCreate, idempotencyKey?: string): Promise<ReservacionPublicaResponse> => {
    const clave = idempotencyKey ?? `envio-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const challenge = await prepararFormularioSeguro(clave);
    const headers: Record<string, string> = {
      "X-Public-Client": obtenerPublicClientId(),
    };
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

    const { data } = await apiClient.post(
      "/publico/reservaciones",
      { ...payload, form_challenge: challenge },
      { headers }
    );
    confirmarFormularioSeguro(clave);
    return data;
  },
};

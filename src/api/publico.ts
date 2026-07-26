import { apiClient } from "./client";
import type {
  CotizacionResponse,
  DisponibilidadResponse,
  FechaBloqueadaPublica,
  FormChallengeResponse,
  PeriodoNoDisponible,
  ReservacionPublicaCreate,
  ReservacionPublicaResponse,
  ServicioPublico,
  TipoReservacion,
  UnidadHospedajePublico,
} from "@/types/publico";

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

  getFormChallenge: async (): Promise<FormChallengeResponse> => {
    const { data } = await apiClient.get("/publico/form-challenge", {
      headers: { "Cache-Control": "no-store" },
    });
    return data;
  },

  crearReservacion: async (payload: ReservacionPublicaCreate, idempotencyKey?: string): Promise<ReservacionPublicaResponse> => {
    const { data } = await apiClient.post("/publico/reservaciones", payload, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    });
    return data;
  },
};

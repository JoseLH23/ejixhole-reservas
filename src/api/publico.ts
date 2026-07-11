import { apiClient } from "./client";
import type {
  CotizacionResponse,
  DisponibilidadResponse,
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

  crearReservacion: async (payload: ReservacionPublicaCreate): Promise<ReservacionPublicaResponse> => {
    const { data } = await apiClient.post("/publico/reservaciones", payload);
    return data;
  },
};

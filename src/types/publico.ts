/** Refleja app/schemas/publico.py del backend. */
export type TipoReservacion = "entrada" | "camping" | "hospedaje";

export interface ServicioPublico {
  nombre: string;
  descripcion: string | null;
  precio: string;
}

export interface UnidadHospedajePublico {
  id: number;
  nombre: string;
  capacidad_maxima: number;
  precio_por_noche: string;
}

export interface DisponibilidadResponse {
  disponible: boolean;
}

export interface FechaBloqueadaPublica {
  fecha_inicio: string;
  fecha_fin: string;
}

export type MotivoNoDisponible = "ocupado" | "bloqueado";

export interface PeriodoNoDisponible {
  fecha_inicio: string;
  fecha_fin: string;
  motivo: MotivoNoDisponible;
}

export interface ConceptoPrecio {
  concepto: string;
  detalle: string;
  subtotal: string;
}

export interface CotizacionResponse {
  noches: number;
  total: string;
  desglose: ConceptoPrecio[];
}

export interface FormChallengeResponse {
  token: string;
  issued_at: string;
  expires_at: string;
  minimum_wait_seconds: number;
  enforcement_mode: "monitor" | "enforce";
}

export interface ReservacionPublicaCreate {
  nombre_completo: string;
  email: string;
  telefono: string;
  tipo_reservacion: TipoReservacion;
  fecha_llegada: string;
  fecha_salida: string;
  num_personas: number;
  unidad_hospedaje_id?: number | null;
  notas?: string | null;
  website?: string | null;
  form_challenge?: string | null;
}

export interface ReservacionPublicaResponse {
  id: number;
  tipo_reservacion: TipoReservacion;
  fecha_llegada: string;
  fecha_salida: string;
  num_personas: number;
  total: string;
  estado: string;
  fecha_creacion: string;
  mensaje: string;
}

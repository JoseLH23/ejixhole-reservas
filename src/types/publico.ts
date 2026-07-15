/**
 * Refleja app/schemas/publico.py del backend tal cual — no se inventa
 * ningún campo que el backend no devuelva.
 */

export type TipoReservacion = "entrada" | "camping" | "hospedaje";

export interface ServicioPublico {
  nombre: string;
  descripcion: string | null;
  precio: string; // Decimal serializado como string
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

export interface ReservacionPublicaCreate {
  nombre_completo: string;
  email: string;
  telefono: string;
  tipo_reservacion: TipoReservacion;
  fecha_llegada: string; // yyyy-MM-dd
  fecha_salida: string;
  num_personas: number;
  unidad_hospedaje_id?: number | null;
  notas?: string | null;
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

export interface EstadoReservaParaEnvio {
  tipoReservacion: "entrada" | "camping" | "hospedaje" | null;
  fechaLlegada: string | null;
  fechaSalida: string | null;
  numPersonas: number;
  unidadHospedajeId: number | null;
}

export interface DatosContactoReserva {
  nombreCompleto: string;
  email: string;
  telefono: string;
  notas?: string;
  quiereCombi: boolean;
}

export interface ProteccionFormularioReserva {
  website?: string;
  formChallenge?: string | null;
}

export function construirNotasReserva(notas: string | undefined, quiereCombi: boolean): string | null {
  if (!quiereCombi) return notas || null;
  return `${notas ?? ""}\n\n[Solicita información de transporte en combi]`.trim();
}

export function construirPayloadReserva(
  estado: EstadoReservaParaEnvio,
  datos: DatosContactoReserva,
  proteccion?: ProteccionFormularioReserva
) {
  if (!estado.tipoReservacion || !estado.fechaLlegada || !estado.fechaSalida) {
    throw new Error("La reservación no tiene tipo y fechas completas.");
  }

  return {
    nombre_completo: datos.nombreCompleto,
    email: datos.email,
    telefono: datos.telefono,
    tipo_reservacion: estado.tipoReservacion,
    fecha_llegada: estado.fechaLlegada,
    fecha_salida: estado.fechaSalida,
    num_personas: estado.numPersonas,
    unidad_hospedaje_id: estado.unidadHospedajeId,
    notas: construirNotasReserva(datos.notas, datos.quiereCombi),
    ...(proteccion
      ? {
          website: proteccion.website ?? "",
          form_challenge: proteccion.formChallenge ?? null,
        }
      : {}),
  };
}

export interface ControlIdempotencia {
  actual: () => string;
  confirmarExito: () => void;
}

/**
 * Mantiene una misma identidad durante errores o timeouts. Solo una respuesta
 * exitosa permite generar una clave nueva para la siguiente reservación real.
 */
export function crearControlIdempotencia(generar: () => string): ControlIdempotencia {
  let clave = generar();
  return {
    actual: () => clave,
    confirmarExito: () => {
      clave = generar();
    },
  };
}

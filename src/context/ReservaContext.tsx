import * as React from "react";
import type { TipoReservacion } from "@/types/publico";

interface EstadoReserva {
  tipoReservacion: TipoReservacion | null;
  fechaLlegada: string | null;
  fechaSalida: string | null;
  numPersonas: number;
  unidadHospedajeId: number | null;
  quiereCombi: boolean;
  // Paso 2
  nombreCompleto: string;
  email: string;
  telefono: string;
  notas: string;
}

const ESTADO_INICIAL: EstadoReserva = {
  tipoReservacion: null,
  fechaLlegada: null,
  fechaSalida: null,
  numPersonas: 1,
  unidadHospedajeId: null,
  quiereCombi: false,
  nombreCompleto: "",
  email: "",
  telefono: "",
  notas: "",
};

// ME-10 (auditoría): persistimos en sessionStorage solo el progreso
// del wizard que no es sensible (tipo, fechas, personas, unidad,
// combi) — así un reload no lo tira. Los datos de contacto
// (nombre/email/teléfono/notas) NUNCA se guardan aquí; si el
// visitante recarga a medio llenar el paso 2, se vuelven a capturar.
type EstadoPersistible = Pick<
  EstadoReserva,
  "tipoReservacion" | "fechaLlegada" | "fechaSalida" | "numPersonas" | "unidadHospedajeId" | "quiereCombi"
>;

const STORAGE_KEY = "ejixhole:reserva-wizard";
const STORAGE_VERSION = 1;
const EXPIRACION_MS = 2 * 60 * 60 * 1000; // 2 horas

interface EstadoAlmacenado {
  version: number;
  expiraEn: number;
  estado: EstadoPersistible;
}

function leerEstadoPersistido(): EstadoPersistible | null {
  try {
    const crudo = sessionStorage.getItem(STORAGE_KEY);
    if (!crudo) return null;
    const datos = JSON.parse(crudo) as Partial<EstadoAlmacenado>;
    if (datos.version !== STORAGE_VERSION || !datos.expiraEn || !datos.estado || Date.now() > datos.expiraEn) {
      limpiarEstadoPersistido();
      return null;
    }
    return datos.estado;
  } catch {
    limpiarEstadoPersistido();
    return null;
  }
}

function guardarEstadoPersistido(estado: EstadoPersistible) {
  try {
    const datos: EstadoAlmacenado = {
      version: STORAGE_VERSION,
      expiraEn: Date.now() + EXPIRACION_MS,
      estado,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  } catch {
    // sessionStorage no disponible (modo privado, cuota llena, etc.)
    // — el wizard sigue funcionando, solo sin persistencia.
  }
}

function limpiarEstadoPersistido() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}

function estadoInicial(): EstadoReserva {
  const persistido = leerEstadoPersistido();
  return persistido ? { ...ESTADO_INICIAL, ...persistido } : ESTADO_INICIAL;
}

interface ReservaContextValue {
  estado: EstadoReserva;
  actualizar: (cambios: Partial<EstadoReserva>) => void;
  reiniciar: () => void;
}

const ReservaContext = React.createContext<ReservaContextValue | undefined>(undefined);

export function ReservaProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = React.useState<EstadoReserva>(estadoInicial);

  React.useEffect(() => {
    const persistible: EstadoPersistible = {
      tipoReservacion: estado.tipoReservacion,
      fechaLlegada: estado.fechaLlegada,
      fechaSalida: estado.fechaSalida,
      numPersonas: estado.numPersonas,
      unidadHospedajeId: estado.unidadHospedajeId,
      quiereCombi: estado.quiereCombi,
    };
    // Sin progreso real (recién reiniciado o nunca se tocó nada): no
    // dejamos una entrada vacía en sessionStorage.
    const sinProgreso = (Object.keys(persistible) as (keyof EstadoPersistible)[]).every(
      (clave) => persistible[clave] === ESTADO_INICIAL[clave]
    );
    if (sinProgreso) {
      limpiarEstadoPersistido();
    } else {
      guardarEstadoPersistido(persistible);
    }
  }, [
    estado.tipoReservacion,
    estado.fechaLlegada,
    estado.fechaSalida,
    estado.numPersonas,
    estado.unidadHospedajeId,
    estado.quiereCombi,
  ]);

  const actualizar = React.useCallback((cambios: Partial<EstadoReserva>) => {
    setEstado((prev) => ({ ...prev, ...cambios }));
  }, []);

  const reiniciar = React.useCallback(() => {
    limpiarEstadoPersistido();
    setEstado(ESTADO_INICIAL);
  }, []);

  return <ReservaContext.Provider value={{ estado, actualizar, reiniciar }}>{children}</ReservaContext.Provider>;
}

export function useReserva() {
  const ctx = React.useContext(ReservaContext);
  if (!ctx) throw new Error("useReserva debe usarse dentro de <ReservaProvider>");
  return ctx;
}

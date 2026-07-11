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

interface ReservaContextValue {
  estado: EstadoReserva;
  actualizar: (cambios: Partial<EstadoReserva>) => void;
  reiniciar: () => void;
}

const ReservaContext = React.createContext<ReservaContextValue | undefined>(undefined);

export function ReservaProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = React.useState<EstadoReserva>(ESTADO_INICIAL);

  const actualizar = React.useCallback((cambios: Partial<EstadoReserva>) => {
    setEstado((prev) => ({ ...prev, ...cambios }));
  }, []);

  const reiniciar = React.useCallback(() => setEstado(ESTADO_INICIAL), []);

  return <ReservaContext.Provider value={{ estado, actualizar, reiniciar }}>{children}</ReservaContext.Provider>;
}

export function useReserva() {
  const ctx = React.useContext(ReservaContext);
  if (!ctx) throw new Error("useReserva debe usarse dentro de <ReservaProvider>");
  return ctx;
}

import * as React from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { publicoApi } from "@/api/publico";
import { useReserva } from "@/context/ReservaContext";
import type { MotivoNoDisponible } from "@/types/publico";
import { cn } from "@/lib/utils";

interface CalendarioFechaProps {
  label: string;
  value: string | null;
  min: string;
  max: string;
  language: string;
  blockedMessage: string;
  onChange: (value: string) => void;
  isBlocked: (value: string) => boolean;
}

function fechaLocalIso(fecha: Date) {
  return format(fecha, "yyyy-MM-dd");
}

function fechaSegura(value: string) {
  return parseISO(`${value}T00:00:00`);
}

export function CalendarioFecha({
  label,
  value,
  min,
  max,
  language,
  blockedMessage,
  onChange,
  isBlocked,
}: CalendarioFechaProps) {
  const { estado } = useReserva();
  const idBase = React.useId();
  const botonId = `calendario-${idBase}`;
  const dialogoId = `${botonId}-dialogo`;
  const contenedorRef = React.useRef<HTMLDivElement>(null);
  const botonRef = React.useRef<HTMLButtonElement>(null);
  const [abierto, setAbierto] = React.useState(false);
  const [mesVisible, setMesVisible] = React.useState(() => startOfMonth(fechaSegura(value ?? min)));
  const hoy = fechaLocalIso(new Date());
  const esCalendarioSalida = min > hoy;
  const unidadId = estado.tipoReservacion === "hospedaje" ? estado.unidadHospedajeId : null;

  const { data: periodos = [], isFetching } = useQuery({
    queryKey: ["publico", "disponibilidad-calendario", unidadId, min, max],
    queryFn: () =>
      publicoApi.getDisponibilidadCalendario({
        unidad_hospedaje_id: unidadId!,
        desde: hoy,
        hasta: max,
      }),
    enabled: Boolean(unidadId),
    staleTime: 60_000,
  });

  React.useEffect(() => {
    if (value) setMesVisible(startOfMonth(fechaSegura(value)));
  }, [value]);

  React.useEffect(() => {
    if (!abierto) return;
    const cerrar = (event: MouseEvent) => {
      if (!contenedorRef.current?.contains(event.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, [abierto]);

  React.useEffect(() => {
    if (!abierto) return;
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setAbierto(false);
      botonRef.current?.focus();
    };
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  const primerMes = startOfMonth(fechaSegura(min));
  const ultimoMes = startOfMonth(fechaSegura(max));
  const dias = eachDayOfInterval({
    start: startOfWeek(startOfMonth(mesVisible), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(mesVisible), { weekStartsOn: 1 }),
  });
  const diasSemana = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(language, { weekday: "narrow" }).format(addDays(new Date(2024, 0, 1), index))
  );
  const formatoFecha = new Intl.DateTimeFormat(language, { day: "numeric", month: "long", year: "numeric" });
  const formatoMes = new Intl.DateTimeFormat(language, { month: "long", year: "numeric" });

  function motivoNoDisponible(fecha: string): MotivoNoDisponible | null {
    if (isBlocked(fecha)) return "bloqueado";
    if (!unidadId) return null;

    const coincidencias = periodos.filter((periodo) => {
      if (esCalendarioSalida && estado.fechaLlegada) {
        // La salida puede coincidir con el inicio de otra ocupación: se
        // validan las noches [llegada, salida), no el día de salida.
        return periodo.fecha_inicio < fecha && periodo.fecha_fin >= estado.fechaLlegada;
      }
      return periodo.fecha_inicio <= fecha && periodo.fecha_fin >= fecha;
    });

    if (coincidencias.some((periodo) => periodo.motivo === "bloqueado")) return "bloqueado";
    if (coincidencias.length > 0) return "ocupado";
    return null;
  }

  function seleccionar(fecha: Date) {
    onChange(fechaLocalIso(fecha));
    setAbierto(false);
  }

  const mensajeOcupado = language.toLowerCase().startsWith("en") ? "Occupied" : "Ocupado";
  const mensajeCerrado = language.toLowerCase().startsWith("en") ? "Closed" : blockedMessage;

  return (
    <div ref={contenedorRef} className="relative">
      <label htmlFor={botonId} className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <button
        ref={botonRef}
        id={botonId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-controls={abierto ? dialogoId : undefined}
        onClick={() => setAbierto((actual) => !actual)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value ? formatoFecha.format(fechaSegura(value)) : label}
          </span>
        </span>
        <ChevronDown aria-hidden="true" className={cn("h-4 w-4 shrink-0 transition-transform", abierto && "rotate-180")} />
      </button>

      {abierto && (
        <div id={dialogoId} role="dialog" aria-label={label} className="absolute left-0 z-30 mt-2 w-full min-w-[290px] rounded-xl border border-border bg-card p-3 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <button type="button" disabled={mesVisible.getTime() <= primerMes.getTime()} onClick={() => setMesVisible((actual) => subMonths(actual, 1))} aria-label={formatoMes.format(subMonths(mesVisible, 1))} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <p className="flex items-center gap-2 capitalize text-sm font-semibold text-foreground">
              {formatoMes.format(mesVisible)}
              {isFetching && <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            </p>
            <button type="button" disabled={mesVisible.getTime() >= ultimoMes.getTime()} onClick={() => setMesVisible((actual) => addMonths(actual, 1))} aria-label={formatoMes.format(addMonths(mesVisible, 1))} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {diasSemana.map((dia, index) => <span key={`${dia}-${index}`} className="py-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">{dia}</span>)}
            {dias.map((dia) => {
              const iso = fechaLocalIso(dia);
              const fueraDeRango = iso < min || iso > max;
              const motivo = fueraDeRango ? null : motivoNoDisponible(iso);
              const deshabilitado = fueraDeRango || Boolean(motivo);
              const seleccionado = value ? isSameDay(dia, fechaSegura(value)) : false;
              const fueraDeMes = !isSameMonth(dia, mesVisible);
              const mensaje = motivo === "ocupado" ? mensajeOcupado : mensajeCerrado;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={deshabilitado}
                  title={motivo ? mensaje : formatoFecha.format(dia)}
                  aria-label={motivo ? `${formatoFecha.format(dia)}. ${mensaje}` : formatoFecha.format(dia)}
                  aria-pressed={seleccionado}
                  onClick={() => seleccionar(dia)}
                  className={cn(
                    "relative aspect-square rounded-lg text-xs font-medium transition-colors",
                    fueraDeMes && "text-muted-foreground/45",
                    !deshabilitado && "hover:bg-primary/10 hover:text-primary",
                    seleccionado && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    fueraDeRango && "cursor-not-allowed text-muted-foreground/25",
                    motivo === "bloqueado" && "cursor-not-allowed border border-destructive/20 bg-destructive/10 text-destructive/70 line-through",
                    motivo === "ocupado" && "cursor-not-allowed border border-amber-300/50 bg-amber-100/70 text-amber-800"
                  )}
                >
                  {format(dia, "d")}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-destructive/20 bg-destructive/10" />{mensajeCerrado}</span>
            {unidadId && <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-amber-300/50 bg-amber-100/70" />{mensajeOcupado}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

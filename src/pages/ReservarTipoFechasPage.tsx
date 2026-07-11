import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tent, Home, Sun, ArrowRight, Loader2, Calendar, Users, CheckCircle2, Info } from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import { publicoApi } from "@/api/publico";
import type { TipoReservacion } from "@/types/publico";
import { WizardSteps } from "@/components/reservar/WizardSteps";
import { AvisoComida } from "@/components/inicio/AvisoComida";
import { cn } from "@/lib/utils";

const OPCIONES_TIPO: { tipo: TipoReservacion; icon: typeof Tent; proximamente?: boolean }[] = [
  { tipo: "entrada", icon: Sun },
  { tipo: "camping", icon: Tent },
  { tipo: "hospedaje", icon: Home, proximamente: true },
];

function extraerMensajeError(err: unknown, fallback: string): string {
  const detalle = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detalle === "string" ? detalle : fallback;
}

export function ReservarTipoFechasPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { estado, actualizar } = useReserva();
  const [error, setError] = React.useState<string | null>(null);

  const { data: unidades } = useQuery({
    queryKey: ["publico", "unidades-hospedaje"],
    queryFn: publicoApi.getUnidadesHospedaje,
    enabled: estado.tipoReservacion === "hospedaje",
  });

  const unidadSeleccionada = unidades?.find((u) => u.id === estado.unidadHospedajeId);

  // Validación de capacidad EN EL FRONTEND, antes de siquiera llamar
  // al backend — así el usuario ve el problema de inmediato, no un
  // resumen vacío sin explicación (el bug que reportaste).
  const excedeCapacidad =
    estado.tipoReservacion === "hospedaje" && !!unidadSeleccionada && estado.numPersonas > unidadSeleccionada.capacidad_maxima;

  const fechasCompletas =
    !!estado.fechaLlegada &&
    !!estado.fechaSalida &&
    (estado.tipoReservacion !== "hospedaje" || !!estado.unidadHospedajeId);

  const { data: disponibilidad, isFetching: verificandoDisponibilidad } = useQuery({
    queryKey: ["publico", "disponibilidad", estado.unidadHospedajeId, estado.fechaLlegada, estado.fechaSalida],
    queryFn: () =>
      publicoApi.getDisponibilidad({
        unidad_hospedaje_id: estado.unidadHospedajeId!,
        fecha_llegada: estado.fechaLlegada!,
        fecha_salida: estado.fechaSalida!,
      }),
    enabled: estado.tipoReservacion === "hospedaje" && !!estado.unidadHospedajeId && !!estado.fechaLlegada && !!estado.fechaSalida,
  });

  const puedeCotizar =
    fechasCompletas &&
    estado.numPersonas > 0 &&
    !excedeCapacidad &&
    (estado.tipoReservacion !== "hospedaje" || disponibilidad?.disponible !== false);

  const {
    data: cotizacion,
    isFetching: cotizando,
    isError: errorCotizando,
    error: errorCotizacionRaw,
  } = useQuery({
    queryKey: [
      "publico",
      "cotizar",
      estado.tipoReservacion,
      estado.fechaLlegada,
      estado.fechaSalida,
      estado.numPersonas,
      estado.unidadHospedajeId,
    ],
    queryFn: () =>
      publicoApi.cotizar({
        tipo_reservacion: estado.tipoReservacion!,
        fecha_llegada: estado.fechaLlegada!,
        fecha_salida: estado.fechaSalida!,
        num_personas: estado.numPersonas,
        unidad_hospedaje_id: estado.unidadHospedajeId,
      }),
    enabled: !!puedeCotizar,
    retry: false,
  });

  const seleccionarTipo = (tipo: TipoReservacion) => {
    setError(null);
    actualizar({ tipoReservacion: tipo, unidadHospedajeId: null, fechaLlegada: null, fechaSalida: null });
  };

  const handleFechaLlegada = (valor: string) => {
    actualizar({
      fechaLlegada: valor,
      fechaSalida: estado.tipoReservacion === "entrada" ? valor : estado.fechaSalida,
    });
  };

  const continuar = () => {
    if (!estado.tipoReservacion || !estado.fechaLlegada || !estado.fechaSalida) {
      setError(t("errores.campoRequerido"));
      return;
    }
    if (estado.tipoReservacion === "hospedaje" && !estado.unidadHospedajeId) {
      setError(t("errores.campoRequerido"));
      return;
    }
    if (excedeCapacidad) {
      setError(t("reservar.excedeCapacidad", { max: unidadSeleccionada?.capacidad_maxima }));
      return;
    }
    if (estado.tipoReservacion === "hospedaje" && disponibilidad?.disponible === false) {
      setError(t("reservar.noDisponible"));
      return;
    }
    navigate("/reservar/datos");
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8 text-center text-primary-foreground">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t("hero.titulo")}</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <WizardSteps pasoActual={1} />

        <h2 className="mt-8 font-display text-2xl font-semibold text-foreground">{t("reservar.tipo.titulo")}</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {OPCIONES_TIPO.map(({ tipo, icon: Icon, proximamente }) => {
            const seleccionado = estado.tipoReservacion === tipo;
            return (
              <button
                key={tipo}
                onClick={() => !proximamente && seleccionarTipo(tipo)}
                disabled={proximamente}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                  proximamente
                    ? "cursor-not-allowed border-border bg-muted/50 opacity-70"
                    : seleccionado
                      ? "border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20"
                      : "border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                )}
              >
                {proximamente && (
                  <span className="absolute right-3 top-3 rounded-full bg-wood/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-wood">
                    {t("reservar.proximamente")}
                  </span>
                )}
                {seleccionado && !proximamente && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-primary" />}
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                    seleccionado && !proximamente ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t(`reservar.tipo.${tipo}`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`reservar.tipo.${tipo}Desc`)}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Grupos grandes: no existe una sola reservación que combine
            hospedaje + camping — se le explica la solución real (2
            solicitudes) en vez de dejarlo adivinar por qué falla. */}
        {estado.tipoReservacion === "hospedaje" && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-secondary/30 bg-secondary/5 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p>{t("reservar.avisoGrupoGrande")}</p>
          </div>
        )}

        {estado.tipoReservacion && (
          <div className="mt-8 space-y-5">
            {estado.tipoReservacion === "hospedaje" && unidades && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t("reservar.elegirUnidad")}</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {unidades.map((unidad) => {
                    const seleccionada = estado.unidadHospedajeId === unidad.id;
                    return (
                      <button
                        key={unidad.id}
                        onClick={() => actualizar({ unidadHospedajeId: unidad.id })}
                        className={cn(
                          "relative rounded-lg border p-3 text-left text-sm transition-all",
                          seleccionada ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 hover:bg-accent"
                        )}
                      >
                        {seleccionada && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-primary" />}
                        <p className="font-medium">{unidad.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          ${Number(unidad.precio_por_noche).toFixed(0)} · {t("reservar.maximoPersonas", { max: unidad.capacidad_maxima })}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {estado.tipoReservacion === "entrada" ? t("reservar.fecha") : t("reservar.fechaLlegada")}
                </label>
                <input
                  type="date"
                  value={estado.fechaLlegada ?? ""}
                  onChange={(e) => handleFechaLlegada(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {estado.tipoReservacion !== "entrada" && (
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("reservar.fechaSalida")}
                  </label>
                  <input
                    type="date"
                    value={estado.fechaSalida ?? ""}
                    onChange={(e) => actualizar({ fechaSalida: e.target.value })}
                    min={estado.fechaLlegada ?? new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
            </div>

            <div className="max-w-[220px]">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {t("reservar.numPersonas")}
              </label>
              <input
                type="number"
                min={1}
                value={estado.numPersonas}
                onChange={(e) => actualizar({ numPersonas: Math.max(1, Number(e.target.value)) })}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2",
                  excedeCapacidad
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-primary/20"
                )}
              />
              {unidadSeleccionada && (
                <p className={cn("mt-1 text-xs", excedeCapacidad ? "font-medium text-destructive" : "text-muted-foreground")}>
                  {t("reservar.maximoPersonas", { max: unidadSeleccionada.capacidad_maxima })}
                </p>
              )}
            </div>

            {estado.tipoReservacion === "hospedaje" && estado.unidadHospedajeId && estado.fechaLlegada && estado.fechaSalida && !excedeCapacidad && (
              <p className="text-sm">
                {verificandoDisponibilidad ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {t("reservar.verificandoDisponibilidad")}
                  </span>
                ) : disponibilidad?.disponible ? (
                  <span className="flex items-center gap-1.5 font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    {t("reservar.disponible")}
                  </span>
                ) : (
                  <span className="font-medium text-destructive">{t("reservar.noDisponible")}</span>
                )}
              </p>
            )}

            {excedeCapacidad && (
              <p className="text-sm font-medium text-destructive">
                {t("reservar.excedeCapacidad", { max: unidadSeleccionada?.capacidad_maxima })}
              </p>
            )}

            {puedeCotizar && (
              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("reservar.resumen")}</p>
                {cotizando ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : errorCotizando ? (
                  <p className="mt-2 text-sm font-medium text-destructive">
                    {extraerMensajeError(errorCotizacionRaw, t("errores.generico"))}
                  </p>
                ) : cotizacion ? (
                  <>
                    {/* Desglose real por concepto — para que siempre sepan qué se les cobra, no solo el total. */}
                    <ul className="mt-2 space-y-1.5 border-b border-primary/10 pb-3">
                      {cotizacion.desglose.map((linea) => (
                        <li key={linea.concepto} className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="text-foreground">
                            {linea.concepto}
                            <span className="ml-1.5 text-xs text-muted-foreground">({linea.detalle})</span>
                          </span>
                          <span className="shrink-0 font-medium text-foreground">${Number(linea.subtotal).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{t("reservar.total")}</span>
                      <span className="font-display text-3xl font-semibold text-foreground">
                        ${Number(cotizacion.total).toFixed(2)}
                      </span>
                    </p>
                    {estado.tipoReservacion === "entrada" && (
                      <p className="mt-2 text-xs text-destructive">{t("reservar.avisoNoReembolsable")}</p>
                    )}
                  </>
                ) : null}
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              onClick={continuar}
              disabled={!puedeCotizar || !cotizacion}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-medium text-primary-foreground shadow-md transition-all hover:enabled:scale-[1.01] hover:enabled:shadow-lg disabled:opacity-40"
            >
              {t("reservar.continuar")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <AvisoComida />
    </div>
  );
}

import * as React from "react";
import { addDays, addYears, format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tent, Home, Sun, ArrowRight, Loader2, Users, CheckCircle2, Info } from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import { publicoApi } from "@/api/publico";
import type { FechaBloqueadaPublica, TipoReservacion } from "@/types/publico";
import { WizardSteps } from "@/components/reservar/WizardSteps";
import { CalendarioFecha } from "@/components/reservar/CalendarioFecha";
import { AvisoComida } from "@/components/inicio/AvisoComida";
import { cn } from "@/lib/utils";

const OPCIONES_TIPO: { tipo: TipoReservacion; icon: typeof Tent; proximamente?: boolean }[] = [
  { tipo: "entrada", icon: Sun },
  { tipo: "camping", icon: Tent },
  { tipo: "hospedaje", icon: Home, proximamente: true },
];

interface ReservarTipoFechasPageProps {
  bloqueos?: FechaBloqueadaPublica[];
}

function extraerMensajeError(err: unknown, fallback: string): string {
  const detalle = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detalle === "string" ? detalle : fallback;
}

function fechaEnBloqueo(fecha: string, bloqueos: FechaBloqueadaPublica[]) {
  return bloqueos.some(
    (bloqueo) => bloqueo.fecha_inicio <= fecha && bloqueo.fecha_fin >= fecha
  );
}

function rangoEnBloqueo(
  fechaLlegada: string,
  fechaSalida: string,
  tipo: TipoReservacion,
  bloqueos: FechaBloqueadaPublica[]
) {
  if (tipo === "entrada") return fechaEnBloqueo(fechaLlegada, bloqueos);

  // Camping y hospedaje ocupan noches en [llegada, salida). El primer
  // día bloqueado sí puede elegirse como check-out, pero no como noche.
  return bloqueos.some(
    (bloqueo) =>
      bloqueo.fecha_inicio < fechaSalida && bloqueo.fecha_fin >= fechaLlegada
  );
}

export function ReservarTipoFechasPage({ bloqueos = [] }: ReservarTipoFechasPageProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { estado, actualizar } = useReserva();
  const [error, setError] = React.useState<string | null>(null);
  const hoy = format(new Date(), "yyyy-MM-dd");
  const fechaLimite = format(addYears(new Date(), 1), "yyyy-MM-dd");

  const [personasTexto, setPersonasTexto] = React.useState(String(estado.numPersonas));
  React.useEffect(() => {
    setPersonasTexto(String(estado.numPersonas));
  }, [estado.numPersonas]);

  React.useEffect(() => {
    if (!estado.tipoReservacion || bloqueos.length === 0) return;

    if (estado.fechaLlegada && fechaEnBloqueo(estado.fechaLlegada, bloqueos)) {
      actualizar({ fechaLlegada: null, fechaSalida: null });
      return;
    }

    if (
      estado.fechaLlegada &&
      estado.fechaSalida &&
      rangoEnBloqueo(
        estado.fechaLlegada,
        estado.fechaSalida,
        estado.tipoReservacion,
        bloqueos
      )
    ) {
      actualizar({ fechaSalida: null });
    }
  }, [
    actualizar,
    bloqueos,
    estado.fechaLlegada,
    estado.fechaSalida,
    estado.tipoReservacion,
  ]);

  const { data: unidades } = useQuery({
    queryKey: ["publico", "unidades-hospedaje"],
    queryFn: publicoApi.getUnidadesHospedaje,
    enabled: estado.tipoReservacion === "hospedaje",
  });

  const unidadSeleccionada = unidades?.find((u) => u.id === estado.unidadHospedajeId);
  const excedeCapacidad =
    estado.tipoReservacion === "hospedaje" &&
    !!unidadSeleccionada &&
    estado.numPersonas > unidadSeleccionada.capacidad_maxima;

  const fechasCompletas =
    !!estado.fechaLlegada &&
    !!estado.fechaSalida &&
    (estado.tipoReservacion !== "hospedaje" || !!estado.unidadHospedajeId);

  const rangoBloqueado = Boolean(
    estado.tipoReservacion &&
      estado.fechaLlegada &&
      estado.fechaSalida &&
      rangoEnBloqueo(
        estado.fechaLlegada,
        estado.fechaSalida,
        estado.tipoReservacion,
        bloqueos
      )
  );

  const { data: disponibilidad, isFetching: verificandoDisponibilidad } = useQuery({
    queryKey: ["publico", "disponibilidad", estado.unidadHospedajeId, estado.fechaLlegada, estado.fechaSalida],
    queryFn: () =>
      publicoApi.getDisponibilidad({
        unidad_hospedaje_id: estado.unidadHospedajeId!,
        fecha_llegada: estado.fechaLlegada!,
        fecha_salida: estado.fechaSalida!,
      }),
    enabled:
      estado.tipoReservacion === "hospedaje" &&
      !!estado.unidadHospedajeId &&
      !!estado.fechaLlegada &&
      !!estado.fechaSalida &&
      !rangoBloqueado,
  });

  const puedeCotizar =
    fechasCompletas &&
    estado.numPersonas > 0 &&
    !excedeCapacidad &&
    !rangoBloqueado &&
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
    actualizar({
      tipoReservacion: tipo,
      unidadHospedajeId: null,
      fechaLlegada: null,
      fechaSalida: null,
    });
  };

  const handleFechaLlegada = (valor: string) => {
    if (estado.tipoReservacion === "entrada") {
      actualizar({ fechaLlegada: valor, fechaSalida: valor });
      return;
    }

    const salidaActual = estado.fechaSalida;
    const salidaSigueValida =
      salidaActual &&
      salidaActual > valor &&
      estado.tipoReservacion &&
      !rangoEnBloqueo(valor, salidaActual, estado.tipoReservacion, bloqueos);

    actualizar({
      fechaLlegada: valor,
      fechaSalida: salidaSigueValida ? salidaActual : null,
    });
  };

  const continuar = () => {
    if (!estado.tipoReservacion || !estado.fechaLlegada || !estado.fechaSalida) {
      setError(t("errores.campoRequerido"));
      return;
    }
    if (rangoBloqueado) {
      setError(t("reservar.noDisponible"));
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

  const fechaSalidaMinima = estado.fechaLlegada
    ? format(addDays(parseISO(`${estado.fechaLlegada}T00:00:00`), 1), "yyyy-MM-dd")
    : hoy;

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
                type="button"
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
                        type="button"
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
              <CalendarioFecha
                label={estado.tipoReservacion === "entrada" ? t("reservar.fecha") : t("reservar.fechaLlegada")}
                value={estado.fechaLlegada}
                min={hoy}
                max={fechaLimite}
                language={i18n.language}
                blockedMessage={t("reservar.noDisponible")}
                onChange={handleFechaLlegada}
                isBlocked={(fecha) => fechaEnBloqueo(fecha, bloqueos)}
              />

              {estado.tipoReservacion !== "entrada" && (
                <CalendarioFecha
                  label={t("reservar.fechaSalida")}
                  value={estado.fechaSalida}
                  min={fechaSalidaMinima}
                  max={fechaLimite}
                  language={i18n.language}
                  blockedMessage={t("reservar.noDisponible")}
                  onChange={(fechaSalida) => actualizar({ fechaSalida })}
                  isBlocked={(fechaSalida) =>
                    estado.fechaLlegada
                      ? rangoEnBloqueo(
                          estado.fechaLlegada,
                          fechaSalida,
                          estado.tipoReservacion!,
                          bloqueos
                        )
                      : false
                  }
                />
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
                value={personasTexto}
                onChange={(e) => {
                  const crudo = e.target.value;
                  setPersonasTexto(crudo);
                  if (crudo !== "" && !Number.isNaN(Number(crudo))) {
                    actualizar({ numPersonas: Math.max(1, Number(crudo)) });
                  }
                }}
                onBlur={() => {
                  const numero = Math.max(1, Number(personasTexto) || 1);
                  setPersonasTexto(String(numero));
                  actualizar({ numPersonas: numero });
                }}
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

            {rangoBloqueado && (
              <p className="text-sm font-medium text-destructive">{t("reservar.noDisponible")}</p>
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
              type="button"
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

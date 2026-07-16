import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CalendarX2, Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { publicoApi } from "@/api/publico";
import { ReservarTipoFechasPage } from "@/pages/ReservarTipoFechasPage";

function fechaIsoLocal(fecha: Date) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function formatearFecha(fechaIso: string, idioma: string) {
  return new Intl.DateTimeFormat(idioma, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fechaIso}T00:00:00`));
}

export function ReservarInicioPage() {
  const { t, i18n } = useTranslation();
  const hoy = new Date();
  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + 365);

  const {
    data: bloqueos,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["publico", "fechas-bloqueadas", fechaIsoLocal(hoy)],
    queryFn: () =>
      publicoApi.getFechasBloqueadas({
        desde: fechaIsoLocal(hoy),
        hasta: fechaIsoLocal(limite),
      }),
    staleTime: 5 * 60_000,
    retry: false,
  });

  return (
    <>
      {isError && (
        <section className="border-b border-amber-300/50 bg-amber-50" role="status">
          <div className="mx-auto flex max-w-2xl items-start gap-3 px-4 py-3 sm:px-6">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {t("reservar.errorConsultaCierresTitulo")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {t("reservar.errorConsultaCierresDescripcion")}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-lg border border-amber-300 bg-background px-3 py-1.5 text-xs font-semibold text-foreground disabled:opacity-60"
              >
                {isFetching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {t("reservar.reintentar")}
              </button>
            </div>
          </div>
        </section>
      )}

      {!isError && (isLoading || (bloqueos?.length ?? 0) > 0) && (
        <section className="border-b border-destructive/15 bg-destructive/[0.04]">
          <div className="mx-auto flex max-w-2xl items-start gap-3 px-4 py-3 sm:px-6">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <CalendarX2 className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {isLoading ? t("reservar.verificandoDisponibilidad") : t("reservar.noDisponible")}
              </p>
              {!isLoading && bloqueos && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {bloqueos.slice(0, 8).map((bloqueo) => (
                    <span
                      key={`${bloqueo.fecha_inicio}-${bloqueo.fecha_fin}`}
                      className="rounded-full border border-destructive/20 bg-background px-2.5 py-1 text-xs font-medium text-destructive"
                    >
                      {bloqueo.fecha_inicio === bloqueo.fecha_fin
                        ? formatearFecha(bloqueo.fecha_inicio, i18n.language)
                        : `${formatearFecha(bloqueo.fecha_inicio, i18n.language)} – ${formatearFecha(
                            bloqueo.fecha_fin,
                            i18n.language
                          )}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <ReservarTipoFechasPage bloqueos={bloqueos ?? []} />
    </>
  );
}

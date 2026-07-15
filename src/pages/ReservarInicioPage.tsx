import { useQuery } from "@tanstack/react-query";
import { CalendarX2, Loader2 } from "lucide-react";
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

  const { data: bloqueos, isLoading } = useQuery({
    queryKey: ["publico", "fechas-bloqueadas", fechaIsoLocal(hoy)],
    queryFn: () =>
      publicoApi.getFechasBloqueadas({
        desde: fechaIsoLocal(hoy),
        hasta: fechaIsoLocal(limite),
      }),
    staleTime: 5 * 60_000,
  });

  return (
    <>
      {(isLoading || (bloqueos?.length ?? 0) > 0) && (
        <section className="border-b border-destructive/15 bg-destructive/[0.04]">
          <div className="mx-auto flex max-w-2xl items-start gap-3 px-4 py-3 sm:px-6">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarX2 className="h-4 w-4" />}
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
      <ReservarTipoFechasPage />
    </>
  );
}

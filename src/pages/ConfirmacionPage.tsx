import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarDays, CheckCircle2, ClipboardCheck, Users } from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import type { ReservacionPublicaResponse } from "@/types/publico";
import { WizardSteps } from "@/components/reservar/WizardSteps";

function formatearFecha(fecha: string, idioma: string) {
  return new Intl.DateTimeFormat(idioma, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fecha}T00:00:00`));
}

export function ConfirmacionPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { reiniciar } = useReserva();

  const respuesta = (location.state as { respuesta?: ReservacionPublicaResponse } | null)?.respuesta;

  React.useEffect(() => {
    if (!respuesta) {
      navigate("/", { replace: true });
    }
  }, [respuesta, navigate]);

  const volverInicio = () => {
    reiniciar();
    navigate("/");
  };

  if (!respuesta) return null;

  const fechas =
    respuesta.fecha_llegada === respuesta.fecha_salida
      ? formatearFecha(respuesta.fecha_llegada, i18n.language)
      : `${formatearFecha(respuesta.fecha_llegada, i18n.language)} → ${formatearFecha(
          respuesta.fecha_salida,
          i18n.language
        )}`;

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8 text-center text-primary-foreground">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t("hero.titulo")}</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <WizardSteps pasoActual={3} />

        <div className="mt-8 rounded-2xl border border-success/30 bg-success/5 p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
            {t("confirmacion.titulo")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {respuesta.mensaje}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-success/20 bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            <ClipboardCheck className="h-4 w-4 text-success" aria-hidden="true" />
            {t("confirmacion.folio")}: #{respuesta.id}
          </div>
          <p className="mt-3 text-xs font-medium text-muted-foreground">
            {t("confirmacion.guardarFolio")}
          </p>
        </div>

        <section className="mt-6 rounded-xl border border-border bg-card p-5 text-sm" aria-labelledby="detalles-confirmacion">
          <p id="detalles-confirmacion" className="font-semibold text-foreground">
            {t("confirmacion.detalles")}
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">{t(`reservar.tipo.${respuesta.tipo_reservacion}`)}</span>
              <span className="text-right font-medium text-foreground">#{respuesta.id}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {t("reservar.fechasSeleccionadas")}
              </span>
              <span className="text-right font-medium text-foreground">{fechas}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" aria-hidden="true" />
                {t("reservar.numPersonas")}
              </span>
              <span className="font-medium text-foreground">{respuesta.num_personas}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 font-semibold text-foreground">
              <span>{t("reservar.total")}</span>
              <span>${Number(respuesta.total).toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.03] p-5" aria-labelledby="que-sigue">
          <p id="que-sigue" className="font-semibold text-foreground">
            {t("confirmacion.queSigue")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("confirmacion.queSigueDescripcion")}
          </p>
        </section>

        <button
          type="button"
          onClick={volverInicio}
          className="mt-6 min-h-12 w-full rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground"
        >
          {t("confirmacion.volverInicio")}
        </button>
      </div>
    </div>
  );
}

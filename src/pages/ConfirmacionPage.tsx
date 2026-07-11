import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import type { ReservacionPublicaResponse } from "@/types/publico";
import { WizardSteps } from "@/components/reservar/WizardSteps";

export function ConfirmacionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { reiniciar } = useReserva();

  const respuesta = (location.state as { respuesta?: ReservacionPublicaResponse } | null)?.respuesta;

  // Sin datos reales de confirmación (llegó aquí sin reservar), regresa al inicio.
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

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8 text-center text-primary-foreground">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t("hero.titulo")}</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <WizardSteps pasoActual={3} />

      <div className="mt-8 rounded-xl border border-success/30 bg-success/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">{t("confirmacion.titulo")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{respuesta.mensaje}</p>
        <p className="mt-3 inline-block rounded-full bg-card px-4 py-1.5 text-sm font-medium">
          {t("confirmacion.folio")}: #{respuesta.id}
        </p>
      </div>

      <div className="mt-6 space-y-2 rounded-xl border border-border bg-card p-5 text-sm">
        <p className="mb-2 font-medium text-foreground">{t("confirmacion.detalles")}</p>
        <div className="flex justify-between text-muted-foreground">
          <span>{t(`reservar.tipo.${respuesta.tipo_reservacion}`)}</span>
          <span>
            {respuesta.fecha_llegada}
            {respuesta.fecha_llegada !== respuesta.fecha_salida ? ` → ${respuesta.fecha_salida}` : ""}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>{t("reservar.numPersonas")}</span>
          <span>{respuesta.num_personas}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-medium text-foreground">
          <span>{t("reservar.total")}</span>
          <span>${Number(respuesta.total).toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={volverInicio}
        className="mt-6 w-full rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground"
      >
        {t("confirmacion.volverInicio")}
      </button>
      </div>
    </div>
  );
}

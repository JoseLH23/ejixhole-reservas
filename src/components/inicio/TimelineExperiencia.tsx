import { useTranslation } from "react-i18next";
import { Calendar, MapPin, CheckCircle2, Compass, Camera, Home } from "lucide-react";

/**
 * Único ícono nuevo sin usar antes en el proyecto: Camera. El resto
 * (Calendar, MapPin, CheckCircle2, Compass, Home) ya están probados
 * en el asistente de reservación real, sin errores.
 */
const PASOS = [
  { key: "reserva", icon: Calendar },
  { key: "llegada", icon: MapPin },
  { key: "checkin", icon: CheckCircle2 },
  { key: "actividades", icon: Compass },
  { key: "fotografias", icon: Camera },
  { key: "regreso", icon: Home },
] as const;

export function TimelineExperiencia() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("timeline.titulo")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("timeline.descripcion")}</p>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
        {PASOS.map(({ key, icon: Icon }, i) => (
          <div key={key} className="relative flex flex-col items-center text-center">
            {/* Línea conectora — solo entre pasos, no al final */}
            {i < PASOS.length - 1 && (
              <div className="absolute left-1/2 top-6 hidden h-0.5 w-full bg-border md:block" style={{ left: "60%" }} />
            )}
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t(`timeline.pasos.${key}.numero`)}
            </p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{t(`timeline.pasos.${key}.titulo`)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t(`timeline.pasos.${key}.descripcion`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

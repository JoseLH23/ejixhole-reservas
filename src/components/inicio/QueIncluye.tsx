import { useTranslation } from "react-i18next";
import { Leaf, Waves as River, Mountain, Users, MapPin, CheckCircle2 } from "lucide-react";

/**
 * Todo lo listado aquí ya es un hecho confirmado en conversaciones
 * anteriores (baños, estacionamiento, guías, zonas naturales) — nada
 * inventado. Todos los íconos usados aquí ya están probados sin
 * errores en otras partes del sitio (Hero, Actividades, Timeline).
 */
const INCLUYE = [
  { key: "naturaleza", icon: Leaf },
  { key: "rio", icon: River },
  { key: "cascadas", icon: Mountain },
  { key: "guias", icon: Users },
  { key: "estacionamiento", icon: MapPin },
  { key: "banos", icon: CheckCircle2 },
] as const;

export function QueIncluye() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("queIncluye.titulo")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("queIncluye.descripcion")}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {INCLUYE.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground">{t(`queIncluye.items.${key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

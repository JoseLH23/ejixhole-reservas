import { useTranslation } from "react-i18next";
import { Droplet, Sun, Footprints, Camera, ShieldCheck, Lightbulb } from "lucide-react";

/**
 * Rediseño pendiente de la lista original: ya no son solo 3 datos de
 * Google Maps sueltos — ahora son tarjetas de preparación accionables,
 * con contenido 100% real (viene de las respuestas del FAQ que el
 * cliente ya confirmó: qué llevar, ropa, calzado). Los 3 datos de
 * Maps se conservan abajo, con menos peso visual, sin perderlos.
 */
const PREPARACION = [
  { key: "agua", icon: Droplet },
  { key: "sol", icon: Sun },
  { key: "calzado", icon: Footprints },
  { key: "camara", icon: Camera },
  { key: "repelente", icon: ShieldCheck },
] as const;

export function ConsejosVisita() {
  const { t } = useTranslation();
  const tipsMaps = t("consejos.items", { returnObjects: true }) as string[];

  return (
    <section className="bg-accent/40 py-10"><div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("consejos.tituloPrep")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("consejos.descripcionPrep")}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {PREPARACION.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-foreground">{t(`consejos.prep.${key}`)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tipsMaps.map((consejo) => (
          <div key={consejo} className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/40 p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-wood" />
            <p className="text-xs text-muted-foreground">{consejo}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

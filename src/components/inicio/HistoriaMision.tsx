import { useTranslation } from "react-i18next";
import { Leaf, Compass, CheckCircle2 } from "lucide-react";

export function HistoriaMision() {
  const { t } = useTranslation();
  const compromisos = t("historia.conservacion.items", { returnObjects: true }) as string[];

  return (
    <section className="bg-muted py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Leaf className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{t("historia.historia.titulo")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("historia.historia.texto")}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Compass className="h-6 w-6 text-secondary" />
            <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{t("historia.mision.titulo")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("historia.mision.texto")}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <CheckCircle2 className="h-6 w-6 text-wood" />
            <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{t("historia.conservacion.titulo")}</h3>
            <ul className="mt-2 space-y-1.5">
              {compromisos.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wood" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

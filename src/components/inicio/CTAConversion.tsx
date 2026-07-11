import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

/**
 * A propósito distinto del banner oscuro que quitamos antes (ese se
 * sentía redundante con el Hero). Este vive DESPUÉS de las Opiniones
 * reales — el momento donde el visitante ya generó confianza, no al
 * inicio. Diseño de franja horizontal, no de sección completa.
 */
export function CTAConversion() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="mb-1 flex items-center justify-center gap-1 sm:justify-start">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-wood text-wood" />
            ))}
          </div>
          <p className="font-display text-lg font-semibold text-foreground">{t("ctaConversion.titulo")}</p>
          <p className="text-sm text-muted-foreground">{t("ctaConversion.descripcion")}</p>
        </div>
        <button
          onClick={() => navigate("/reservar")}
          className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          {t("hero.boton")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}

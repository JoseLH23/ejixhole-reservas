import { ArrowRight, BadgeCheck, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TRUST_ITEMS = [
  { key: "ubicacion", icon: MapPin, label: "footer.ubicacion" },
  { key: "opiniones", icon: Star, label: "hero.calificacion" },
  { key: "guias", icon: BadgeCheck, label: "queIncluye.items.guias" },
] as const;

/**
 * Refuerza confianza inmediatamente después del hero y mantiene la acción
 * principal al alcance del pulgar en móvil. No incluye precios, promociones
 * ni disponibilidad: esos datos siguen viniendo del backend.
 */
export function ConversionSupport() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <section
        aria-label={t("hero.boton")}
        className="mx-auto max-w-6xl px-4 pt-4 sm:px-6"
      >
        <div className="grid gap-2 rounded-2xl border border-primary/10 bg-white p-3 shadow-sm sm:grid-cols-3 sm:gap-0 sm:p-2">
          {TRUST_ITEMS.map(({ key, icon: Icon, label }, index) => (
            <div
              key={key}
              className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/80 ${
                index > 0 ? "sm:border-l sm:border-primary/10" : ""
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className={`h-4 w-4 ${key === "opiniones" ? "fill-current" : ""}`} />
              </span>
              <span className="font-medium">{t(label)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <button
          type="button"
          onClick={() => navigate("/reservar")}
          className="pointer-events-auto flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.28)] transition active:scale-[0.99]"
        >
          {t("hero.boton")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}

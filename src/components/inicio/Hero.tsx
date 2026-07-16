import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, Compass, Waves, Heart, MapPin, Star } from "lucide-react";

import { ClimaWidget } from "./ClimaWidget";

const INSIGNIAS = [
  { key: "naturaleza", icon: Leaf },
  { key: "aventura", icon: Compass },
  { key: "agua", icon: Waves },
  { key: "momentos", icon: Heart },
] as const;

export function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl shadow-xl md:grid-cols-5">
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary p-6 sm:p-8 md:col-span-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-secondary/40 blur-3xl"
          />

          <div className="relative z-10">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/80">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {t("footer.ubicacion")}
            </p>

            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" aria-hidden="true" />
              <span className="text-xs font-semibold text-white">4.7</span>
              <span className="text-xs text-white/80">{t("hero.calificacion")}</span>
            </div>

            <h1 className="font-display text-4xl font-semibold leading-[0.95] text-white drop-shadow-lg sm:text-5xl">
              {t("hero.titulo")}
            </h1>
            <p className="mt-2 font-display text-lg italic text-white/90 sm:text-xl">{t("hero.eslogan")}</p>
            <p className="mt-3 max-w-md text-sm text-white/90 sm:text-base">{t("hero.descripcion")}</p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/reservar")}
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-primary shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                {t("hero.boton")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
              <a
                href="#actividades"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                {t("hero.botonSecundario")}
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {INSIGNIAS.map(({ key, icon: Icon }) => (
              <div key={key} className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40">
                  <Icon className="h-3 w-3" aria-hidden="true" />
                </span>
                {t(`hero.insignias.${key}`)}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[16rem] overflow-hidden bg-foreground md:col-span-3 md:min-h-0">
          <img
            src="/gallery/hero-principal.jpg"
            alt="Cascada y alberca de aguas turquesa en EjiXhole"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-l" />
          <div className="absolute bottom-3 right-3 w-44">
            <ClimaWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

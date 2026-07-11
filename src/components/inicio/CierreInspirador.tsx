import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CierreInspirador() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
      <img
        src="/gallery/visitantes-2.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />

      <div className="relative z-10">
        <p className="font-display text-3xl italic text-white drop-shadow-lg sm:text-4xl">{t("cierre.frase")}</p>
        <p className="mx-auto mt-4 max-w-md text-white/90">{t("cierre.subtexto")}</p>
        <button
          onClick={() => navigate("/reservar")}
          className="group mx-auto mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-medium text-primary shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          {t("hero.boton")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}

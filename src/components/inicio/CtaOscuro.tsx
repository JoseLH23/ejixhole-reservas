import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CtaOscuro() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden bg-foreground py-12">
      <img
        src="/park/canoa.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/95 to-foreground" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{t("ctaOscuro.titulo")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">{t("ctaOscuro.descripcion")}</p>
        <button
          onClick={() => navigate("/reservar")}
          className="group mx-auto mt-7 inline-flex items-center gap-2 rounded-lg bg-secondary px-7 py-3.5 font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          {t("hero.boton")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}

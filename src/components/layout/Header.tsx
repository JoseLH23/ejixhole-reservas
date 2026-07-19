import * as React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { IconoTikTok, IconoFacebook } from "@/components/shared/IconosRedesSociales";

// Mismos datos reales que ya usaba el Footer — se reutilizan aquí, no
// se duplica la fuente de verdad de las URLs.
const REDES = [
  { nombre: "TikTok", url: "https://www.tiktok.com/@ejixhole.parque.e", Icono: IconoTikTok },
  { nombre: "Facebook", url: "https://www.facebook.com/share/1bmjun99j4/", Icono: IconoFacebook },
];

export function Header() {
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith("en") ? "en" : "es";
  }, [i18n.language]);

  const cambiarIdioma = (idioma: "es" | "en") => {
    i18n.changeLanguage(idioma);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <img src="/logo.png?v=3" alt="" aria-hidden="true" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-lg font-semibold text-foreground">EjiXhole</span>
        </Link>

        <nav aria-label={t("nav.navegacionPrincipal")} className="flex items-center gap-4">
          <Link to="/" className="hidden rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:block">
            {t("nav.inicio")}
          </Link>

          {/* Redes sociales — antes solo vivían hasta el fondo del Footer. */}
          <div className="hidden items-center gap-2 sm:flex">
            {REDES.map(({ nombre, url, Icono }) => (
              <a
                key={nombre}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={nombre}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Icono className="h-4 w-4" />
              </a>
            ))}
          </div>

          <Link
            to="/reservar"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {t("nav.reservar")}
          </Link>

          <div
            role="group"
            aria-label={t("nav.selectorIdioma")}
            className="flex items-center overflow-hidden rounded-md border border-border text-xs font-medium"
          >
            <button
              type="button"
              onClick={() => cambiarIdioma("es")}
              aria-label={t("nav.espanol")}
              aria-pressed={i18n.language.startsWith("es")}
              className={`px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                i18n.language === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => cambiarIdioma("en")}
              aria-label={t("nav.ingles")}
              aria-pressed={i18n.language.startsWith("en")}
              className={`px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                i18n.language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

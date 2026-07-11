import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const cambiarIdioma = (idioma: "es" | "en") => {
    i18n.changeLanguage(idioma);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png?v=3" alt="EjiXhole" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-lg font-semibold text-foreground">EjiXhole</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="hidden text-sm font-medium text-foreground/70 hover:text-foreground sm:block">
            {t("nav.inicio")}
          </Link>
          <button
            onClick={() => navigate("/reservar")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("nav.reservar")}
          </button>

          <div className="flex items-center overflow-hidden rounded-md border border-border text-xs font-medium">
            <button
              onClick={() => cambiarIdioma("es")}
              className={`px-2 py-1.5 transition-colors ${
                i18n.language === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => cambiarIdioma("en")}
              className={`px-2 py-1.5 transition-colors ${
                i18n.language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

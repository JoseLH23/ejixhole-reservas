import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFlotante } from "@/components/shared/WhatsAppFlotante";
import { BarraProgreso } from "@/components/shared/BarraProgreso";

export function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const contenidoRef = React.useRef<HTMLElement>(null);
  const primeraRuta = React.useRef(true);
  const tituloRuta = location.pathname === "/"
    ? t("nav.inicio")
    : location.pathname === "/reservar/datos"
      ? t("reservar.datosTitulo")
      : location.pathname === "/reservar/confirmacion"
        ? t("confirmacion.titulo")
        : t("nav.reservar");

  React.useEffect(() => {
    if (primeraRuta.current) {
      primeraRuta.current = false;
      return;
    }
    contenidoRef.current?.focus();
  }, [location.pathname]);

  React.useEffect(() => {
    document.title = `${tituloRuta} | EjiXhole`;
  }, [tituloRuta]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#contenido-principal"
        className="sr-only z-[100] rounded-md bg-card px-4 py-3 font-semibold text-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {t("nav.saltarContenido")}
      </a>
      <BarraProgreso />
      <Header />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {tituloRuta}
      </p>
      <main
        ref={contenidoRef}
        id="contenido-principal"
        tabIndex={-1}
        className="flex-1 outline-none"
      >
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFlotante />
    </div>
  );
}

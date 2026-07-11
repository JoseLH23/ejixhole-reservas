import { useTranslation } from "react-i18next";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";

import { IconoTikTok, IconoFacebook } from "@/components/shared/IconosRedesSociales";

/** Datos reales dados por el cliente — nada inventado. */
const REDES = [
  { nombre: "TikTok", url: "https://www.tiktok.com/@ejixhole.parque.e", Icono: IconoTikTok },
  { nombre: "Facebook", url: "https://www.facebook.com/share/1bmjun99j4/", Icono: IconoFacebook },
];
const CORREO = "ejixhole@gmail.com";
const TELEFONO = "+52 444 498 2492";
const WHATSAPP_URL = `https://wa.me/${TELEFONO.replace(/[^0-9]/g, "")}`;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png?v=3" alt="EjiXhole" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-display text-lg font-semibold text-foreground">EjiXhole</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t("footer.descripcion")}</p>
          </div>

          <div className="text-sm">
            <p className="mb-2 font-medium text-foreground">{t("footer.contacto")}</p>
            <div className="space-y-1.5 text-muted-foreground">
              <a href={`mailto:${CORREO}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" /> {CORREO}
              </a>
              <a href={`tel:${TELEFONO.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4" /> {TELEFONO}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {t("footer.ubicacion")}
              </p>
            </div>
          </div>

          <div className="text-sm">
            <p className="mb-2 font-medium text-foreground">{t("footer.siguenos")}</p>
            <div className="flex items-center gap-2">
              {REDES.map(({ nombre, url, Icono }) => (
                <a
                  key={nombre}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nombre}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icono className="h-3.5 w-3.5" />
                  {nombre}
                </a>
              ))}
            </div>
            <p className="mt-4 font-medium text-foreground">{t("footer.horario")}</p>
            <p className="text-muted-foreground">{t("footer.horarioValor")}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-border py-5 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} EjiXhole. {t("footer.derechos")}
          </p>
        </div>
      </div>
    </footer>
  );
}

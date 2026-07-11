import { useTranslation } from "react-i18next";
import { ExternalLink, MapPin, Compass } from "lucide-react";

import { COORDENADAS_EL_NARANJO } from "@/api/clima";

const URL_EXTERNA = "https://maps.app.goo.gl/pL6fXWkSfea3kBd49";
const URL_EMBED = `https://www.google.com/maps?q=${COORDENADAS_EL_NARANJO.lat},${COORDENADAS_EL_NARANJO.lon}&z=15&output=embed`;

/**
 * Investigados por mí (no dados por el cliente) en varias fuentes de
 * rutas reales — cruzando resultados y descartando cifras claramente
 * erróneas (una fuente daba 9h para un trayecto de 260km, imposible).
 * Se presentan como aproximados, con invitación a verificar en Maps —
 * nunca como garantía exacta, porque son estimaciones de terceros,
 * no datos operados por EjiXhole.
 */
const TIEMPOS_DESDE = [
  { ciudad: "Ciudad Valles", tiempo: "~1h 15min" },
  { ciudad: "San Luis Potosí", tiempo: "~3h 15min" },
  { ciudad: "Tampico", tiempo: "~3h 10min" },
  { ciudad: "Monterrey", tiempo: "~5h 35min" },
];

export function MapaComoLlegar() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">{t("mapa.titulo")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("mapa.descripcion")}</p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-border shadow-sm md:col-span-3">
          <iframe
            title="Mapa EjiXhole"
            src={URL_EMBED}
            width="100%"
            height="340"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-xl border border-wood/25 bg-accent p-5 md:col-span-2">
          <div>
            <div className="flex items-center gap-2 text-wood">
              <Compass className="h-4 w-4" />
              <p className="text-sm font-semibold uppercase tracking-wide">{t("mapa.caminoTitulo")}</p>
            </div>
            <p className="mt-2 text-sm text-foreground">{t("mapa.caminoTexto")}</p>

            <div className="mt-4 space-y-1.5 border-t border-wood/20 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("mapa.tiemposTitulo")}</p>
              {TIEMPOS_DESDE.map(({ ciudad, tiempo }) => (
                <div key={ciudad} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{ciudad}</span>
                  <span className="font-medium text-muted-foreground">{tiempo}</span>
                </div>
              ))}
              <p className="pt-1 text-[11px] text-muted-foreground">{t("mapa.tiemposAviso")}</p>
            </div>
          </div>

          <a
            href={URL_EXTERNA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MapPin className="h-4 w-4" />
            {t("mapa.abrirGoogleMaps")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

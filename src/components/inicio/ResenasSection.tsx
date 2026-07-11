import * as React from "react";
import { useTranslation } from "react-i18next";
import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const URL_MAPS = "https://maps.app.goo.gl/pL6fXWkSfea3kBd49";

/**
 * 9 reseñas reales, tal cual de la ficha de Google Maps de EjiXhole
 * (capturas compartidas por el cliente). Se incluyen también las de 3
 * y 4 estrellas a propósito — un carrusel con solo reseñas perfectas
 * se siente falso; mostrar la calificación real completa da más
 * confianza, no menos.
 */
const RESENAS_REALES = [
  { autor: "rocio ceron", estrellas: 5, tiempo: "Hace 7 años", texto: "El mejor lugar para vacacionar. Tranquilo y muy seguro." },
  { autor: "Podliculas de Cristal", estrellas: 5, tiempo: "Hace 5 años", texto: "Hermoso, super bien cuidado. Perfecto para los que les encanta nadar." },
  { autor: "jose francisco García", estrellas: 5, tiempo: "Hace 7 años", texto: "Un lugar estupendo para pasarla en familia o con amigos, tranquilo, hermoso y simplemente perfecto." },
  { autor: "Franz Wolf", estrellas: 5, tiempo: "Hace 6 años", texto: "Bonito lugar, aunque algo lejos. Un buen lugar para estar apartado de la sociedad y poder relajarse." },
  { autor: "MONY BERNAL", estrellas: 5, tiempo: "Hace 7 años", texto: "Muy hermoso y relajante! Aunque algo tétrico de noche 👻" },
  { autor: "Emilio Rocha", estrellas: 5, tiempo: "Hace 7 años", texto: "Lugar muy hermoso." },
  { autor: "Coni Ceniceros", estrellas: 4, tiempo: "Hace 7 años", texto: "Muy agradable, hermoso lugar. Mi familia y yo lo disfrutamos a lo máximo." },
  { autor: "Felipe Castillo", estrellas: 4, tiempo: "Hace 3 meses", texto: "Uffff, uffff, y recontra uffff. ¡Excelente lugar!" },
  { autor: "Raúl Edgardo De León Gómez", estrellas: 3, tiempo: "Hace 8 años", texto: "Aún en desarrollo pero con gran potencial." },
];

const CALIFICACION_PROMEDIO = 4.7;
const TOTAL_OPINIONES = 23;

function Estrellas({ cantidad, tamano = "h-3.5 w-3.5" }: { cantidad: number; tamano?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${tamano} ${i < cantidad ? "fill-wood text-wood" : "text-border"}`} />
      ))}
    </div>
  );
}

export function ResenasSection() {
  const { t } = useTranslation();
  const [indice, setIndice] = React.useState(0);

  React.useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((i) => (i + 1) % RESENAS_REALES.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const anterior = () => setIndice((i) => (i - 1 + RESENAS_REALES.length) % RESENAS_REALES.length);
  const siguiente = () => setIndice((i) => (i + 1) % RESENAS_REALES.length);
  const resena = RESENAS_REALES[indice];

  return (
    <section className="bg-muted py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("resenas.titulo")}</h2>
            <div className="mt-1 flex items-center gap-2">
              <Estrellas cantidad={Math.round(CALIFICACION_PROMEDIO)} tamano="h-4 w-4" />
              <span className="text-sm font-medium text-foreground">{CALIFICACION_PROMEDIO}</span>
              <span className="text-sm text-muted-foreground">
                ({TOTAL_OPINIONES} {t("resenas.opiniones")})
              </span>
            </div>
          </div>
          <a
            href={URL_MAPS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {t("resenas.verTodas")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={anterior}
            aria-label="Anterior"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="min-h-[9.5rem] flex-1 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <Estrellas cantidad={resena.estrellas} tamano="h-4 w-4" />
            <p className="mx-auto mt-3 max-w-lg text-foreground">"{resena.texto}"</p>
            <p className="mt-3 text-sm font-medium text-muted-foreground">— {resena.autor} · {resena.tiempo}</p>
          </div>

          <button
            onClick={siguiente}
            aria-label="Siguiente"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {RESENAS_REALES.map((r, i) => (
            <button
              key={r.autor}
              onClick={() => setIndice(i)}
              aria-label={`Ir a la reseña ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === indice ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

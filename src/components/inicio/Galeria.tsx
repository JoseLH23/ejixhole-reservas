import * as React from "react";
import { useTranslation } from "react-i18next";

import { Lightbox } from "@/components/shared/Lightbox";

/**
 * 18 fotos reales del parque, organizadas por categoría. Reemplazan
 * los 4 recortes de baja resolución que usábamos antes — estas son
 * fotos de cámara real (3000-4000px de origen), redimensionadas para
 * web sin perder nitidez.
 */
const FOTOS = [
  { archivo: "rio-1", categoria: "rio" },
  { archivo: "rio-2", categoria: "rio" },
  { archivo: "rio-3", categoria: "rio" },
  { archivo: "cascada-1", categoria: "cascadas" },
  { archivo: "cascada-2", categoria: "cascadas" },
  { archivo: "cascada-3", categoria: "cascadas" },
  { archivo: "cascada-4", categoria: "cascadas" },
  { archivo: "cascada-5", categoria: "cascadas" },
  { archivo: "camping-1", categoria: "camping" },
  { archivo: "camping-2", categoria: "camping" },
  { archivo: "actividad-kayak", categoria: "actividades" },
  { archivo: "actividad-paddleboard", categoria: "actividades" },
  { archivo: "actividad-nado", categoria: "actividades" },
  { archivo: "actividad-flotador", categoria: "actividades" },
  { archivo: "visitantes-1", categoria: "visitantes" },
  { archivo: "visitantes-2", categoria: "visitantes" },
  { archivo: "visitantes-3", categoria: "visitantes" },
  { archivo: "visitantes-4", categoria: "visitantes" },
] as const;

const CATEGORIAS = ["todas", "rio", "cascadas", "camping", "actividades", "visitantes"] as const;
type Categoria = (typeof CATEGORIAS)[number];

export function Galeria() {
  const { t } = useTranslation();
  const [filtro, setFiltro] = React.useState<Categoria>("todas");
  const [indiceAbierto, setIndiceAbierto] = React.useState<number | null>(null);

  const fotosFiltradas = filtro === "todas" ? FOTOS : FOTOS.filter((f) => f.categoria === filtro);
  const fotosLightbox = fotosFiltradas.map((f) => ({
    src: `/gallery/${f.archivo}.jpg`,
    alt: t(`galeria.categorias.${f.categoria}`),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("galeria.titulo")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("galeria.descripcion")}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filtro === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {t(`galeria.categorias.${cat}`)}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {fotosFiltradas.map(({ archivo, categoria }, i) => (
          <button
            key={archivo}
            onClick={() => setIndiceAbierto(i)}
            className="group relative aspect-square overflow-hidden rounded-xl text-left"
          >
            <img
              src={`/gallery/${archivo}.jpg`}
              alt={t(`galeria.categorias.${categoria}`)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading={i < 4 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {indiceAbierto !== null && (
        <Lightbox fotos={fotosLightbox} indiceInicial={indiceAbierto} onClose={() => setIndiceAbierto(null)} />
      )}
    </section>
  );
}

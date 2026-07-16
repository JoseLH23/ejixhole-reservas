import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Lightbox } from "@/components/shared/Lightbox";

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
const LIMITE_INICIAL = 8;
type Categoria = (typeof CATEGORIAS)[number];

function claseEditorial(indice: number, total: number) {
  if (total < 4) return "aspect-[4/3]";
  if (indice === 0) return "col-span-2 row-span-2 aspect-square sm:aspect-auto";
  if (indice === 1 || indice === 4) return "col-span-1 row-span-2 min-h-64";
  return "aspect-square";
}

export function Galeria() {
  const { t } = useTranslation();
  const [filtro, setFiltro] = React.useState<Categoria>("todas");
  const [indiceAbierto, setIndiceAbierto] = React.useState<number | null>(null);
  const [mostrarTodas, setMostrarTodas] = React.useState(false);

  const fotosFiltradas = filtro === "todas" ? FOTOS : FOTOS.filter((f) => f.categoria === filtro);
  const limitarGaleria = filtro === "todas" && !mostrarTodas;
  const fotosVisibles = limitarGaleria ? fotosFiltradas.slice(0, LIMITE_INICIAL) : fotosFiltradas;
  const fotosRestantes = fotosFiltradas.length - fotosVisibles.length;
  const fotosLightbox = fotosFiltradas.map((f) => ({
    src: `/gallery/${f.archivo}.jpg`,
    alt: t(`galeria.categorias.${f.categoria}`),
  }));

  const seleccionarFiltro = (categoria: Categoria) => {
    setFiltro(categoria);
    setMostrarTodas(categoria !== "todas");
    setIndiceAbierto(null);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{t("galeria.titulo")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{t("galeria.descripcion")}</p>
        </div>

        <div className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-end sm:overflow-visible">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => seleccionarFiltro(cat)}
              aria-pressed={filtro === cat}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                filtro === cat
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {t(`galeria.categorias.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid auto-rows-[8rem] grid-cols-2 gap-3 sm:auto-rows-[10rem] sm:grid-cols-3 md:grid-cols-4">
        {fotosVisibles.map(({ archivo, categoria }, i) => (
          <button
            key={archivo}
            type="button"
            onClick={() => setIndiceAbierto(i)}
            aria-label={`${t("galeria.titulo")}: ${t(`galeria.categorias.${categoria}`)}`}
            className={`group relative overflow-hidden rounded-2xl bg-muted text-left shadow-sm transition-shadow hover:shadow-xl ${claseEditorial(i, fotosVisibles.length)}`}
          >
            <img
              src={`/gallery/${archivo}.jpg`}
              alt={t(`galeria.categorias.${categoria}`)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
            <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {t(`galeria.categorias.${categoria}`)}
            </span>
          </button>
        ))}
      </div>

      {filtro === "todas" && fotosFiltradas.length > LIMITE_INICIAL && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setMostrarTodas((actual) => !actual)}
            aria-expanded={mostrarTodas}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40"
          >
            {mostrarTodas
              ? t("galeria.mostrarMenos")
              : t("galeria.mostrarMas", { cantidad: fotosRestantes })}
            {mostrarTodas ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      )}

      {indiceAbierto !== null && (
        <Lightbox fotos={fotosLightbox} indiceInicial={indiceAbierto} onClose={() => setIndiceAbierto(null)} />
      )}
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Ship,
  Compass,
  Footprints,
  LifeBuoy,
  Sailboat,
  Anchor,
  CircleDot,
  Mountain,
  Fish,
  Users,
  PartyPopper,
  Waves,
  type LucideIcon,
} from "lucide-react";

import { publicoApi } from "@/api/publico";

function metadataDeActividad(
  nombre: string
): { duracion: string; dificultad: string; edad: string } | { nota: string } | null {
  const texto = nombre.toLowerCase();
  if (texto.includes("chaleco")) return { nota: "Obligatorio para todas las edades" };
  if (texto.includes("senderismo")) return { duracion: "1–2 h", dificultad: "Fácil", edad: "8+" };
  if (texto.includes("lancha inflable")) return { duracion: "2 h", dificultad: "Media", edad: "12+" };
  if (texto.includes("lancha")) return { duracion: "30–45 min", dificultad: "Fácil", edad: "Todas las edades" };
  if (texto.includes("kayak")) return { duracion: "2 h", dificultad: "Media", edad: "12+" };
  if (texto.includes("snorkel")) return { duracion: "45–60 min", dificultad: "Media", edad: "10+" };
  if (texto.includes("pesca")) return { duracion: "2–4 h", dificultad: "Fácil", edad: "Todas las edades" };
  if (texto.includes("caballo")) return { duracion: "45–60 min", dificultad: "Fácil", edad: "8+" };
  if (texto.includes("tubing")) return { duracion: "30–40 min", dificultad: "Media", edad: "10+" };
  if (texto.includes("saltos de cascada")) return { duracion: "1–2 h", dificultad: "Alta", edad: "15+ (según guía)" };
  return null;
}

function iconoPorActividad(nombre: string): LucideIcon {
  const texto = nombre.toLowerCase();
  if (texto.includes("caballo")) return Compass;
  if (texto.includes("senderismo")) return Footprints;
  if (texto.includes("chaleco")) return LifeBuoy;
  if (texto.includes("lancha inflable")) return Sailboat;
  if (texto.includes("lancha")) return Ship;
  if (texto.includes("kayak")) return Anchor;
  if (texto.includes("tubing")) return CircleDot;
  if (texto.includes("cascada")) return Mountain;
  if (texto.includes("pesca")) return Fish;
  if (texto.includes("guía") || texto.includes("guia")) return Users;
  if (texto.includes("evento")) return PartyPopper;
  if (texto.includes("snorkel")) return Waves;
  return Waves;
}

function categoriaDeActividad(nombre: string): "agua" | "tierra" | "servicios" {
  const texto = nombre.toLowerCase();
  if (texto.includes("guía") || texto.includes("guia") || texto.includes("evento")) return "servicios";
  if (texto.includes("caballo") || texto.includes("senderismo")) return "tierra";
  return "agua";
}

const ESTILOS_CATEGORIA = {
  agua: {
    contenedor: "border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-card to-blue-50/70",
    icono: "bg-cyan-100 text-cyan-700",
  },
  tierra: {
    contenedor: "border-amber-200/70 bg-gradient-to-br from-amber-50 via-card to-orange-50/70",
    icono: "bg-amber-100 text-amber-700",
  },
  servicios: {
    contenedor: "border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-card to-green-50/70",
    icono: "bg-emerald-100 text-emerald-700",
  },
} as const;

export function ActividadesInformativas() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["publico", "servicios"],
    queryFn: publicoApi.getServicios,
  });

  return (
    <section id="actividades" className="bg-muted py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{t("actividades.titulo")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{t("actividades.nota")}</p>
        </div>

        {isLoading && (
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="min-h-44 animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        )}

        {!isLoading && data && (
          <div className="mt-8 space-y-10">
            {(["agua", "tierra", "servicios"] as const).map((categoria) => {
              const items = data.filter((s) => categoriaDeActividad(s.nombre) === categoria);
              if (items.length === 0) return null;
              const estilo = ESTILOS_CATEGORIA[categoria];

              return (
                <div key={categoria}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${estilo.icono}`} />
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                      {t(`actividades.categorias.${categoria}`)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((servicio) => {
                      const Icon = iconoPorActividad(servicio.nombre);
                      const meta = metadataDeActividad(servicio.nombre);

                      return (
                        <article
                          key={servicio.nombre}
                          className={`group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${estilo.contenedor}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${estilo.icono}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-semibold leading-snug text-foreground">{servicio.nombre}</h3>
                              {Number(servicio.precio) > 0 && (
                                <p className="mt-1 text-sm font-medium text-secondary">
                                  ${Number(servicio.precio).toFixed(0)} {t("actividades.porPersona")}
                                </p>
                              )}
                            </div>
                          </div>

                          {meta && (
                            <div className="mt-4 border-t border-foreground/10 pt-3 text-xs leading-relaxed text-muted-foreground">
                              {"nota" in meta ? meta.nota : `${meta.duracion} · ${meta.dificultad} · ${meta.edad}`}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

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

/**
 * Ícono propio por actividad (ninguno se repite) — se resuelve por
 * palabra clave del nombre REAL que da el backend, igual patrón ya
 * usado en ProximasReservacionesCards.tsx. Si algún día se agrega una
 * actividad nueva que no calza con ninguna palabra clave, cae a un
 * ícono genérico — nunca rompe.
 */
/**
 * Duración/dificultad/edad recomendada — dato real que dio el
 * cliente. Se empareja por palabra clave, igual patrón que el ícono;
 * si una actividad no calza con ninguna, simplemente no muestra esta
 * fila extra (no se inventa nada para las que faltan).
 */
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

/**
 * Agrupación honesta por tipo de actividad (agua / tierra / servicios)
 * — es una clasificación objetiva, no un ranking de popularidad
 * inventado. Ayuda a escanear la lista sin fabricar datos que no
 * tengo (cuáles son "las más populares" realmente).
 */
function categoriaDeActividad(nombre: string): "agua" | "tierra" | "servicios" {
  const texto = nombre.toLowerCase();
  if (texto.includes("guía") || texto.includes("guia") || texto.includes("evento")) return "servicios";
  if (texto.includes("caballo") || texto.includes("senderismo")) return "tierra";
  return "agua";
}

export function ActividadesInformativas() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["publico", "servicios"],
    queryFn: publicoApi.getServicios,
  });

  return (
    <section id="actividades" className="bg-muted py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("actividades.titulo")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("actividades.nota")}</p>

        {isLoading && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="min-h-32 animate-pulse rounded-xl bg-card" />
            ))}
          </div>
        )}

        {!isLoading && data && (
          <div className="mt-5 space-y-6">
            {(["agua", "tierra", "servicios"] as const).map((categoria) => {
              const items = data.filter((s) => categoriaDeActividad(s.nombre) === categoria);
              if (items.length === 0) return null;
              return (
                <div key={categoria}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                    {t(`actividades.categorias.${categoria}`)}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {items.map((servicio) => {
                      const Icon = iconoPorActividad(servicio.nombre);
                      const meta = metadataDeActividad(servicio.nombre);
                      return (
                        <div
                          key={servicio.nombre}
                          className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-medium leading-tight text-foreground">{servicio.nombre}</p>
                          {Number(servicio.precio) > 0 && (
                            <p className="text-[11px] text-muted-foreground">
                              ${Number(servicio.precio).toFixed(0)} {t("actividades.porPersona")}
                            </p>
                          )}
                          {meta && (
                            <p className="text-[10px] text-muted-foreground">
                              {"nota" in meta ? meta.nota : `${meta.duracion} · ${meta.dificultad} · ${meta.edad}`}
                            </p>
                          )}
                        </div>
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

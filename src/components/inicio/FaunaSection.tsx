import { useTranslation } from "react-i18next";
import { PawPrint, Bird, Fish } from "lucide-react";

/**
 * Contenido 100% real, dado por el cliente (investigó la fauna real
 * de la Huasteca Potosina / El Naranjo). Sin fotos por especie a
 * propósito — usar fotos de animales de internet en un sitio
 * comercial es un riesgo real de derechos de autor. Si el cliente
 * algún día tiene fotos propias de fauna avistada, se integran aquí.
 */
const CATEGORIAS = [
  {
    key: "mamiferos",
    icon: PawPrint,
    especies: [
      "Venado cola blanca",
      "Armadillo",
      "Pecarí de collar (jabalí)",
      "Tlacuache",
      "Tejón",
      "Mapache",
      "Ardillas",
      "Conejos silvestres",
      "Zorrillos",
      "Ocelote",
      "Tigrillo",
      "Leoncillo (margay)",
    ],
  },
  {
    key: "aves",
    icon: Bird,
    especies: [
      "Chachalacas",
      "Faisanes",
      "Guajolote silvestre",
      "Calandrias",
      "Golondrinas",
      "Zopilotes",
      "Patos silvestres",
      "Papán",
      "Papán real",
      "Coas",
      "Turcos",
      "Diversas aves canoras",
    ],
  },
  {
    key: "reptiles",
    icon: Fish,
    especies: ["Iguanas", "Tortugas", "Serpientes", "Diversas lagartijas", "Ranas y sapos", "Peces"],
  },
] as const;

export function FaunaSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted/60 py-10"><div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("fauna.titulo")}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("fauna.descripcion")}</p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {CATEGORIAS.map(({ key, icon: Icon, especies }) => (
          <div key={key} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="font-medium text-foreground">{t(`fauna.categorias.${key}`)}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {especies.map((especie) => (
                <span key={especie} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {especie}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-lg border border-wood/25 bg-accent p-4 text-sm text-foreground">
        {t("fauna.aviso")}
      </p>
      </div>
    </section>
  );
}

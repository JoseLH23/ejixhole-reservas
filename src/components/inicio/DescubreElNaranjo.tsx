import { useTranslation } from "react-i18next";
import { Mountain, Compass } from "lucide-react";

const ATRACTIVOS = [
  { key: "elMeco", icon: Mountain },
  { key: "elSalto", icon: Mountain },
  { key: "rutaTurquesa", icon: Compass },
] as const;

export function DescubreElNaranjo() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted/60 py-10"><div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("descubre.titulo")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("descubre.descripcion")}</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ATRACTIVOS.map(({ key, icon: Icon }) => (
          <div key={key} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-medium text-foreground">{t(`descubre.items.${key}.titulo`)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t(`descubre.items.${key}.texto`)}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

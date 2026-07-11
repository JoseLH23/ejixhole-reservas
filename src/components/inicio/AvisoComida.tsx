import { useTranslation } from "react-i18next";
import { UtensilsCrossed } from "lucide-react";

export function AvisoComida() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-start gap-3 rounded-xl border border-wood/30 bg-accent p-5">
        <UtensilsCrossed className="mt-0.5 h-5 w-5 shrink-0 text-wood" />
        <div>
          <p className="font-medium text-foreground">{t("comida.titulo")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("comida.aviso")}</p>
        </div>
      </div>
    </section>
  );
}

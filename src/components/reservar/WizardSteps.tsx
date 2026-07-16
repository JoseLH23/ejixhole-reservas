import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function WizardSteps({ pasoActual }: { pasoActual: 1 | 2 | 3 }) {
  const { t } = useTranslation();
  const pasos = [
    { numero: 1, label: t("reservar.paso1") },
    { numero: 2, label: t("reservar.paso2") },
    { numero: 3, label: t("reservar.paso3") },
  ];

  return (
    <nav aria-label={t("reservar.progreso", { actual: pasoActual, total: pasos.length })} className="mx-auto max-w-lg">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t("reservar.progreso", { actual: pasoActual, total: pasos.length })}
      </p>

      <ol className="flex items-start justify-between">
        {pasos.map((paso, i) => {
          const completado = paso.numero < pasoActual;
          const actual = paso.numero === pasoActual;

          return (
            <li
              key={paso.numero}
              aria-current={actual ? "step" : undefined}
              className="flex min-w-0 flex-1 items-start"
            >
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    completado || actual
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                    actual && "ring-4 ring-primary/20"
                  )}
                >
                  {completado ? <Check className="h-4 w-4" aria-hidden="true" /> : paso.numero}
                </span>
                <span
                  className={cn(
                    "max-w-[7rem] text-[10px] font-medium leading-tight sm:text-xs",
                    paso.numero <= pasoActual ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {paso.label}
                </span>
              </div>

              {i < pasos.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-1 mt-[1.1rem] h-0.5 min-w-4 flex-1 sm:mx-3",
                    completado ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

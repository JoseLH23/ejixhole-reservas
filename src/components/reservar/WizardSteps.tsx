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
    <div className="mx-auto flex max-w-md items-center justify-between px-4">
      {pasos.map((paso, i) => (
        <div key={paso.numero} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                paso.numero < pasoActual
                  ? "bg-primary text-primary-foreground"
                  : paso.numero === pasoActual
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {paso.numero < pasoActual ? <Check className="h-4 w-4" /> : paso.numero}
            </div>
            <span
              className={cn(
                "hidden text-[11px] font-medium sm:block",
                paso.numero <= pasoActual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {paso.label}
            </span>
          </div>
          {i < pasos.length - 1 && (
            <div className={cn("mx-2 h-0.5 flex-1", paso.numero < pasoActual ? "bg-primary" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  );
}

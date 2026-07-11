import * as React from "react";
import { useTranslation } from "react-i18next";
import { Sun, CloudRain, Cloud, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

import {
  obtenerClima,
  obtenerPronosticoVariosDias,
  descripcionClima,
  type ClimaResultado,
  type DiaPronostico,
} from "@/api/clima";

function IconoClima({ codigo, className }: { codigo: number; className?: string }) {
  if (codigo === 0 || codigo === 1) return <Sun className={className} />;
  if (codigo >= 51) return <CloudRain className={className} />;
  return <Cloud className={className} />;
}

interface ClimaWidgetProps {
  /** yyyy-MM-dd — si no se da, usa hoy. */
  fecha?: string;
}

/**
 * Clima REAL — pronóstico real si la fecha está dentro de los
 * próximos 16 días, o el promedio histórico real (últimos 5 años) si
 * es más lejos. Debajo, una franja de los próximos días — también
 * real, no inventada (Open-Meteo ya la da en la misma consulta).
 */
export function ClimaWidget({ fecha }: ClimaWidgetProps) {
  const { t, i18n } = useTranslation();
  const idioma = i18n.language.startsWith("en") ? "en" : "es";
  const localeDateFns = idioma === "en" ? enUS : es;
  const fechaConsulta = fecha ?? format(new Date(), "yyyy-MM-dd");

  const [resultado, setResultado] = React.useState<ClimaResultado | null>(null);
  const [proximosDias, setProximosDias] = React.useState<DiaPronostico[] | null>(null);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(false);

    Promise.all([obtenerClima(fechaConsulta), obtenerPronosticoVariosDias(5)])
      .then(([actual, dias]) => {
        if (cancelado) return;
        setResultado(actual);
        // La franja siempre muestra los próximos días reales, sin
        // incluir "hoy" dos veces si fechaConsulta ya es hoy.
        setProximosDias(dias.slice(1));
      })
      .catch(() => {
        if (!cancelado) setError(true);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [fechaConsulta]);

  if (cargando) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/30 p-4 text-sm text-white/80 backdrop-blur-md">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("clima.cargando")}
      </div>
    );
  }

  if (error || !resultado) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
        <p className="text-sm text-white/80">{t("clima.error")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <IconoClima codigo={resultado.descripcionCodigo} className="h-10 w-10 text-yellow-300" />
        <div>
          <p className="font-display text-3xl font-semibold text-white">{Math.round(resultado.temperaturaMaxima)}°</p>
          <p className="text-xs text-white/70">{descripcionClima(resultado.descripcionCodigo, idioma)}</p>
        </div>
      </div>
      <p className="mt-1 text-xs text-white/60">
        Máx: {Math.round(resultado.temperaturaMaxima)}° · Mín: {Math.round(resultado.temperaturaMinima)}°
      </p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-secondary">
        {resultado.tipo === "pronostico" ? t("clima.real") : t("clima.historico")}
      </p>

      {proximosDias && proximosDias.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-white/15 pt-3">
          {proximosDias.slice(0, 3).map((dia) => (
            <div key={dia.fecha} className="flex flex-col items-center gap-1">
              <p className="text-[10px] capitalize text-white/70">
                {format(new Date(`${dia.fecha}T00:00:00`), "EEE", { locale: localeDateFns })}
              </p>
              <IconoClima codigo={dia.descripcionCodigo} className="h-4 w-4 text-white/80" />
              <p className="text-xs font-medium text-white">{Math.round(dia.temperaturaMaxima)}°</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

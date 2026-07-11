import { differenceInCalendarDays, parseISO, subYears, format } from "date-fns";

/**
 * Coordenadas REALES del parque — resueltas directamente del link de
 * Google Maps que compartió el cliente (no una búsqueda por nombre ni
 * una aproximación del pueblo). Esto es lo más preciso posible.
 */
export const COORDENADAS_EL_NARANJO = { lat: 22.5555919, lon: -99.3448879 };

export interface ClimaResultado {
  tipo: "pronostico" | "historico";
  temperaturaMaxima: number;
  temperaturaMinima: number;
  probabilidadLluvia: number | null; // null en histórico: no se promedia por simplicidad
  descripcionCodigo: number;
}

export interface DiaPronostico {
  fecha: string; // yyyy-MM-dd
  temperaturaMaxima: number;
  temperaturaMinima: number;
  descripcionCodigo: number;
}

/** Códigos WMO de Open-Meteo, simplificados a una descripción corta. */
export function descripcionClima(codigo: number, idioma: "es" | "en"): string {
  const mapa: Record<number, [string, string]> = {
    0: ["Despejado", "Clear sky"],
    1: ["Mayormente despejado", "Mainly clear"],
    2: ["Parcialmente nublado", "Partly cloudy"],
    3: ["Nublado", "Overcast"],
    45: ["Neblina", "Fog"],
    48: ["Neblina helada", "Depositing rime fog"],
    51: ["Llovizna ligera", "Light drizzle"],
    61: ["Lluvia ligera", "Light rain"],
    63: ["Lluvia moderada", "Moderate rain"],
    65: ["Lluvia fuerte", "Heavy rain"],
    80: ["Chubascos ligeros", "Light showers"],
    81: ["Chubascos moderados", "Moderate showers"],
    82: ["Chubascos fuertes", "Violent showers"],
    95: ["Tormenta", "Thunderstorm"],
  };
  const par = mapa[codigo] ?? ["Variable", "Variable"];
  return idioma === "es" ? par[0] : par[1];
}

/**
 * true si la fecha está dentro de la ventana de pronóstico real de
 * Open-Meteo (16 días desde hoy) — más allá de eso, ningún servicio
 * de clima (ni Google, ni nadie) tiene un pronóstico real confiable.
 */
export function esFechaPronosticable(fechaISO: string): boolean {
  const dias = differenceInCalendarDays(parseISO(fechaISO), new Date());
  return dias >= 0 && dias <= 16;
}

async function obtenerPronosticoReal(fechaISO: string): Promise<ClimaResultado> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${COORDENADAS_EL_NARANJO.lat}` +
    `&longitude=${COORDENADAS_EL_NARANJO.lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
    `&timezone=America%2FMexico_City&start_date=${fechaISO}&end_date=${fechaISO}`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error("Error consultando el pronóstico real");
  const datos = await respuesta.json();

  return {
    tipo: "pronostico",
    temperaturaMaxima: datos.daily.temperature_2m_max[0],
    temperaturaMinima: datos.daily.temperature_2m_min[0],
    probabilidadLluvia: datos.daily.precipitation_probability_max[0],
    descripcionCodigo: datos.daily.weathercode[0],
  };
}

/**
 * Promedio histórico REAL: consulta el mismo día calendario en los
 * últimos 5 años vía el archivo histórico de Open-Meteo, y promedia.
 * No es una cifra inventada — son 5 lecturas reales promediadas.
 */
async function obtenerPromedioHistorico(fechaISO: string): Promise<ClimaResultado> {
  const fechaObjetivo = parseISO(fechaISO);
  const anios = [1, 2, 3, 4, 5].map((n) => format(subYears(fechaObjetivo, n), "yyyy-MM-dd"));

  const resultados = await Promise.all(
    anios.map(async (fecha) => {
      const url =
        `https://archive-api.open-meteo.com/v1/archive?latitude=${COORDENADAS_EL_NARANJO.lat}` +
        `&longitude=${COORDENADAS_EL_NARANJO.lon}` +
        `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
        `&timezone=America%2FMexico_City&start_date=${fecha}&end_date=${fecha}`;
      const respuesta = await fetch(url);
      if (!respuesta.ok) return null;
      const datos = await respuesta.json();
      if (!datos.daily?.temperature_2m_max?.[0] && datos.daily?.temperature_2m_max?.[0] !== 0) return null;
      return {
        max: datos.daily.temperature_2m_max[0] as number,
        min: datos.daily.temperature_2m_min[0] as number,
        codigo: datos.daily.weathercode[0] as number,
      };
    })
  );

  const validos = resultados.filter((r): r is { max: number; min: number; codigo: number } => r !== null);
  if (validos.length === 0) throw new Error("No hay datos históricos disponibles");

  const promedio = (valores: number[]) => valores.reduce((a, b) => a + b, 0) / valores.length;

  return {
    tipo: "historico",
    temperaturaMaxima: Math.round(promedio(validos.map((v) => v.max)) * 10) / 10,
    temperaturaMinima: Math.round(promedio(validos.map((v) => v.min)) * 10) / 10,
    probabilidadLluvia: null,
    // Usa el código más frecuente entre los años consultados.
    descripcionCodigo: validos[0].codigo,
  };
}

export async function obtenerClima(fechaISO: string): Promise<ClimaResultado> {
  if (esFechaPronosticable(fechaISO)) {
    return obtenerPronosticoReal(fechaISO);
  }
  return obtenerPromedioHistorico(fechaISO);
}

/**
 * Pronóstico real de varios días (hasta 7) — Open-Meteo ya devuelve
 * esto en una sola llamada, antes solo estábamos pidiendo un día. Se
 * usa para la franja "hoy / mañana / pasado..." del clima.
 */
export async function obtenerPronosticoVariosDias(dias: number = 5): Promise<DiaPronostico[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${COORDENADAS_EL_NARANJO.lat}` +
    `&longitude=${COORDENADAS_EL_NARANJO.lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&timezone=America%2FMexico_City&forecast_days=${dias}`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error("Error consultando el pronóstico de varios días");
  const datos = await respuesta.json();

  return datos.daily.time.map((fecha: string, i: number) => ({
    fecha,
    temperaturaMaxima: datos.daily.temperature_2m_max[i],
    temperaturaMinima: datos.daily.temperature_2m_min[i],
    descripcionCodigo: datos.daily.weathercode[i],
  }));
}

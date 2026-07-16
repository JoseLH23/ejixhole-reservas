export type NombreMetricaWeb = "FCP" | "LCP" | "CLS" | "INP";

export interface MetricaWeb {
  nombre: NombreMetricaWeb;
  valor: number;
  calificacion: "buena" | "mejorable" | "mala";
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime: number;
  loadTime: number;
}

interface EventTimingEntry extends PerformanceEntry {
  duration: number;
  interactionId?: number;
}

const UMBRALES: Record<NombreMetricaWeb, [number, number]> = {
  FCP: [1_800, 3_000],
  LCP: [2_500, 4_000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
};

function calificar(nombre: NombreMetricaWeb, valor: number): MetricaWeb["calificacion"] {
  const [buena, mala] = UMBRALES[nombre];
  if (valor <= buena) return "buena";
  if (valor <= mala) return "mejorable";
  return "mala";
}

function publicar(nombre: NombreMetricaWeb, valor: number) {
  const metrica: MetricaWeb = {
    nombre,
    valor: nombre === "CLS" ? Number(valor.toFixed(4)) : Math.round(valor),
    calificacion: calificar(nombre, valor),
  };

  window.dispatchEvent(new CustomEvent<MetricaWeb>("ejixhole:web-vital", { detail: metrica }));

  if (import.meta.env.DEV) {
    console.info("[Web Vital]", metrica);
  }

  const endpoint = import.meta.env.VITE_WEB_VITALS_ENDPOINT?.trim();
  if (endpoint && navigator.sendBeacon) {
    const cuerpo = JSON.stringify({
      ...metrica,
      ruta: window.location.pathname,
      instante: new Date().toISOString(),
    });
    navigator.sendBeacon(endpoint, new Blob([cuerpo], { type: "application/json" }));
  }
}

function observar(tipo: string, callback: PerformanceObserverCallback) {
  if (!("PerformanceObserver" in window)) return null;
  if (!PerformanceObserver.supportedEntryTypes?.includes(tipo)) return null;

  const observador = new PerformanceObserver(callback);
  observador.observe({ type: tipo, buffered: true });
  return observador;
}

export function iniciarWebVitals() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  let lcp = 0;
  let cls = 0;
  let inp = 0;
  let reportado = false;

  const observadores = [
    observar("paint", (lista) => {
      const fcp = lista.getEntries().find((entrada) => entrada.name === "first-contentful-paint");
      if (fcp) publicar("FCP", fcp.startTime);
    }),
    observar("largest-contentful-paint", (lista) => {
      const entradas = lista.getEntries() as LargestContentfulPaintEntry[];
      const ultima = entradas[entradas.length - 1];
      if (ultima) lcp = ultima.renderTime || ultima.loadTime || ultima.startTime;
    }),
    observar("layout-shift", (lista) => {
      for (const entrada of lista.getEntries() as LayoutShiftEntry[]) {
        if (!entrada.hadRecentInput) cls += entrada.value;
      }
    }),
    observar("event", (lista) => {
      for (const entrada of lista.getEntries() as EventTimingEntry[]) {
        if ((entrada.interactionId ?? 0) > 0) inp = Math.max(inp, entrada.duration);
      }
    }),
  ].filter(Boolean) as PerformanceObserver[];

  const cerrarMedicion = () => {
    if (reportado) return;
    reportado = true;

    if (lcp > 0) publicar("LCP", lcp);
    publicar("CLS", cls);
    if (inp > 0) publicar("INP", inp);

    observadores.forEach((observador) => observador.disconnect());
  };

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden") cerrarMedicion();
    },
    { once: true }
  );
  window.addEventListener("pagehide", cerrarMedicion, { once: true });
}

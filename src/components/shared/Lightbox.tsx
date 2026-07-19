import * as React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FotoLightbox {
  src: string;
  alt: string;
}

interface LightboxProps {
  fotos: FotoLightbox[];
  indiceInicial: number;
  onClose: () => void;
}

export function Lightbox({ fotos, indiceInicial, onClose }: LightboxProps) {
  const { t } = useTranslation();
  const [indice, setIndice] = React.useState(indiceInicial);
  const dialogoRef = React.useRef<HTMLDivElement>(null);
  const cerrarRef = React.useRef<HTMLButtonElement>(null);
  const descripcionId = React.useId();

  const anterior = React.useCallback(() => setIndice((i) => (i - 1 + fotos.length) % fotos.length), [fotos.length]);
  const siguiente = React.useCallback(() => setIndice((i) => (i + 1) % fotos.length), [fotos.length]);

  React.useEffect(() => {
    const focoAnterior = document.activeElement as HTMLElement | null;
    const overflowAnterior = document.body.style.overflow;
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "Tab") {
        const controles = Array.from(
          dialogoRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? []
        );
        if (controles.length === 0) return;
        const primero = controles[0];
        const ultimo = controles[controles.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    };
    window.addEventListener("keydown", manejarTecla);
    document.body.style.overflow = "hidden";
    cerrarRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", manejarTecla);
      document.body.style.overflow = overflowAnterior;
      focoAnterior?.focus();
    };
  }, [onClose, anterior, siguiente]);

  React.useEffect(() => {
    if (fotos.length < 2) return;

    const indices = [
      (indice - 1 + fotos.length) % fotos.length,
      (indice + 1) % fotos.length,
    ];

    indices.forEach((indiceVecino) => {
      const imagen = new Image();
      imagen.decoding = "async";
      imagen.src = fotos[indiceVecino].src;
    });
  }, [fotos, indice]);

  const foto = fotos[indice];

  return (
    <div
      ref={dialogoRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("galeria.visor")}
      aria-describedby={descripcionId}
    >
      <button
        ref={cerrarRef}
        type="button"
        onClick={onClose}
        aria-label={t("galeria.cerrar")}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      <div aria-live="polite" className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
        {indice + 1} / {fotos.length}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          anterior();
        }}
        aria-label={t("galeria.anterior")}
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>

      <img
        key={foto.src}
        src={foto.src}
        alt={foto.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          siguiente();
        }}
        aria-label={t("galeria.siguiente")}
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      <p id={descripcionId} className="absolute bottom-6 left-1/2 max-w-md -translate-x-1/2 text-center text-sm text-white/90">
        {foto.alt}
      </p>
    </div>
  );
}

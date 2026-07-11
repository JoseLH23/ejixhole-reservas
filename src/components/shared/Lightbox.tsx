import * as React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [indice, setIndice] = React.useState(indiceInicial);

  const anterior = React.useCallback(() => setIndice((i) => (i - 1 + fotos.length) % fotos.length), [fotos.length]);
  const siguiente = React.useCallback(() => setIndice((i) => (i + 1) % fotos.length), [fotos.length]);

  React.useEffect(() => {
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    };
    window.addEventListener("keydown", manejarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", manejarTecla);
      document.body.style.overflow = "";
    };
  }, [onClose, anterior, siguiente]);

  const foto = fotos[indice];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
        {indice + 1} / {fotos.length}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          anterior();
        }}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <img
        src={foto.src}
        alt={foto.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          siguiente();
        }}
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <p className="absolute bottom-6 left-1/2 max-w-md -translate-x-1/2 text-center text-sm text-white/90">
        {foto.alt}
      </p>
    </div>
  );
}

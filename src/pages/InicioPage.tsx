import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Hero } from "@/components/inicio/Hero";
import { ConversionSupport } from "@/components/inicio/ConversionSupport";
import { QueIncluye } from "@/components/inicio/QueIncluye";
import { ActividadesInformativas } from "@/components/inicio/ActividadesInformativas";
import { ResenasSection } from "@/components/inicio/ResenasSection";
import { CTAConversion } from "@/components/inicio/CTAConversion";
import { useScrollReveal } from "@/lib/useScrollReveal";

const Galeria = lazy(() => import("@/components/inicio/Galeria").then((modulo) => ({ default: modulo.Galeria })));
const ConsejosVisita = lazy(() => import("@/components/inicio/ConsejosVisita").then((modulo) => ({ default: modulo.ConsejosVisita })));
const FaunaSection = lazy(() => import("@/components/inicio/FaunaSection").then((modulo) => ({ default: modulo.FaunaSection })));
const MapaComoLlegar = lazy(() => import("@/components/inicio/MapaComoLlegar").then((modulo) => ({ default: modulo.MapaComoLlegar })));
const TimelineExperiencia = lazy(() => import("@/components/inicio/TimelineExperiencia").then((modulo) => ({ default: modulo.TimelineExperiencia })));
const DescubreElNaranjo = lazy(() => import("@/components/inicio/DescubreElNaranjo").then((modulo) => ({ default: modulo.DescubreElNaranjo })));
const HistoriaMision = lazy(() => import("@/components/inicio/HistoriaMision").then((modulo) => ({ default: modulo.HistoriaMision })));
const FAQSection = lazy(() => import("@/components/inicio/FAQSection").then((modulo) => ({ default: modulo.FAQSection })));
const CierreInspirador = lazy(() => import("@/components/inicio/CierreInspirador").then((modulo) => ({ default: modulo.CierreInspirador })));

function SeccionAnimada({ children }: { children: ReactNode }) {
  const { ref, className } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function SeccionDiferida({
  render,
  alturaReserva = "28rem",
}: {
  render: () => ReactNode;
  alturaReserva?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={ref} className="content-auto" style={{ minHeight: visible ? undefined : alturaReserva }}>
      {visible ? (
        <Suspense
          fallback={<div aria-hidden="true" className="mx-auto min-h-64 max-w-6xl animate-pulse bg-muted/30" />}
        >
          {render()}
        </Suspense>
      ) : null}
    </div>
  );
}

export function InicioPage() {
  return (
    <div className="pb-20 md:pb-0">
      <Hero />
      <ConversionSupport />
      <SeccionAnimada>
        <QueIncluye />
      </SeccionAnimada>
      <SeccionAnimada>
        <ActividadesInformativas />
      </SeccionAnimada>
      <SeccionAnimada>
        <ResenasSection />
      </SeccionAnimada>
      <div className="py-6">
        <CTAConversion />
      </div>

      <SeccionDiferida
        alturaReserva="52rem"
        render={() => (
          <SeccionAnimada>
            <Galeria />
          </SeccionAnimada>
        )}
      />
      <SeccionDiferida render={() => <SeccionAnimada><ConsejosVisita /></SeccionAnimada>} />
      <SeccionDiferida render={() => <SeccionAnimada><FaunaSection /></SeccionAnimada>} />
      <SeccionDiferida render={() => <SeccionAnimada><MapaComoLlegar /></SeccionAnimada>} />
      <SeccionDiferida render={() => <SeccionAnimada><TimelineExperiencia /></SeccionAnimada>} />
      <SeccionDiferida render={() => <SeccionAnimada><DescubreElNaranjo /></SeccionAnimada>} />
      <SeccionDiferida render={() => <SeccionAnimada><HistoriaMision /></SeccionAnimada>} />
      <SeccionDiferida render={() => <SeccionAnimada><FAQSection /></SeccionAnimada>} />
      <SeccionDiferida render={() => <SeccionAnimada><CierreInspirador /></SeccionAnimada>} />
    </div>
  );
}

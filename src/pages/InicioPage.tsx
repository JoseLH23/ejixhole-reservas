import type { ReactNode } from "react";

import { Hero } from "@/components/inicio/Hero";
import { ConversionSupport } from "@/components/inicio/ConversionSupport";
import { QueIncluye } from "@/components/inicio/QueIncluye";
import { ActividadesInformativas } from "@/components/inicio/ActividadesInformativas";
import { FaunaSection } from "@/components/inicio/FaunaSection";
import { Galeria } from "@/components/inicio/Galeria";
import { ConsejosVisita } from "@/components/inicio/ConsejosVisita";
import { ResenasSection } from "@/components/inicio/ResenasSection";
import { CTAConversion } from "@/components/inicio/CTAConversion";
import { MapaComoLlegar } from "@/components/inicio/MapaComoLlegar";
import { DescubreElNaranjo } from "@/components/inicio/DescubreElNaranjo";
import { TimelineExperiencia } from "@/components/inicio/TimelineExperiencia";
import { HistoriaMision } from "@/components/inicio/HistoriaMision";
import { FAQSection } from "@/components/inicio/FAQSection";
import { CierreInspirador } from "@/components/inicio/CierreInspirador";
import { useScrollReveal } from "@/lib/useScrollReveal";

function SeccionAnimada({ children }: { children: ReactNode }) {
  const { ref, className } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
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
      <SeccionAnimada>
        <Galeria />
      </SeccionAnimada>
      <SeccionAnimada>
        <ConsejosVisita />
      </SeccionAnimada>
      <SeccionAnimada>
        <FaunaSection />
      </SeccionAnimada>
      <SeccionAnimada>
        <MapaComoLlegar />
      </SeccionAnimada>
      <SeccionAnimada>
        <TimelineExperiencia />
      </SeccionAnimada>
      <SeccionAnimada>
        <DescubreElNaranjo />
      </SeccionAnimada>
      <SeccionAnimada>
        <HistoriaMision />
      </SeccionAnimada>
      <SeccionAnimada>
        <FAQSection />
      </SeccionAnimada>
      <SeccionAnimada>
        <CierreInspirador />
      </SeccionAnimada>
    </div>
  );
}

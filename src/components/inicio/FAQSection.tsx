import * as React from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

import { FAQ_ES, FAQ_EN, type PreguntaFAQ } from "@/data/faq";

function ItemFAQ({ pregunta, respuesta }: PreguntaFAQ) {
  const [abierto, setAbierto] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-sm">
      <button
        onClick={() => setAbierto((a) => !a)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-foreground"
        aria-expanded={abierto}
      >
        {pregunta}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${abierto ? "rotate-180 text-primary" : ""}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: abierto ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-3.5 text-sm text-muted-foreground">{respuesta}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const { t, i18n } = useTranslation();
  const [expandido, setExpandido] = React.useState(false);
  const datos = i18n.language.startsWith("en") ? FAQ_EN : FAQ_ES;

  const destacadas = datos.flatMap((cat) => cat.preguntas.filter((p) => p.destacada));

  return (
    <section className="bg-muted py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{t("faq.titulo")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("faq.descripcion")}</p>

        {!expandido && (
          <>
            <div className="mt-5 space-y-2">
              {destacadas.map((p) => (
                <ItemFAQ key={p.pregunta} {...p} />
              ))}
            </div>
            <button
              onClick={() => setExpandido(true)}
              className="mt-5 w-full rounded-lg border border-border bg-card py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              {t("faq.verMas")}
            </button>
          </>
        )}

        {expandido && (
          <div className="mt-5 space-y-6">
            {datos.map((cat) => (
              <div key={cat.categoria}>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                  <span>{cat.emoji}</span>
                  {cat.categoria}
                </h3>
                <div className="space-y-2">
                  {cat.preguntas.map((p) => (
                    <ItemFAQ key={p.pregunta} {...p} />
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => setExpandido(false)}
              className="w-full rounded-lg border border-border bg-card py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              {t("faq.verMenos")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

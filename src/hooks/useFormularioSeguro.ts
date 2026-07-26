import * as React from "react";

import { publicoApi } from "@/api/publico";
import type { FormChallengeResponse } from "@/types/publico";

const pausa = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, ms)));
const relojMonotono = () =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

function vigenciaMilisegundos(valor: FormChallengeResponse): number {
  const emitido = new Date(valor.issued_at).getTime();
  const expira = new Date(valor.expires_at).getTime();
  return Math.max(0, expira - emitido);
}

export function useFormularioSeguro() {
  const valorRef = React.useRef<FormChallengeResponse | null>(null);
  const recibidoEnRef = React.useRef<number | null>(null);
  const cargaRef = React.useRef<Promise<FormChallengeResponse | null> | null>(null);
  const envioIniciadoRef = React.useRef(false);

  const cargar = React.useCallback(async () => {
    const actual = valorRef.current;
    const recibidoEn = recibidoEnRef.current;
    const vigente =
      actual &&
      recibidoEn !== null &&
      relojMonotono() - recibidoEn < vigenciaMilisegundos(actual);
    if (actual && (envioIniciadoRef.current || vigente)) return actual;
    valorRef.current = null;
    recibidoEnRef.current = null;

    if (!cargaRef.current) {
      cargaRef.current = publicoApi.getFormChallenge().then(
        (nuevo) => {
          valorRef.current = nuevo;
          recibidoEnRef.current = relojMonotono();
          cargaRef.current = null;
          return nuevo;
        },
        () => {
          cargaRef.current = null;
          return null;
        }
      );
    }
    return cargaRef.current;
  }, []);

  React.useEffect(() => {
    void cargar();
  }, [cargar]);

  const prepararProteccion = React.useCallback(async (website: string) => {
    const valor = await cargar();
    const recibidoEn = recibidoEnRef.current;
    if (valor && recibidoEn !== null) {
      const transcurrido = relojMonotono() - recibidoEn;
      const esperaRestante = valor.minimum_wait_seconds * 1000 - transcurrido;
      if (esperaRestante > 0) await pausa(esperaRestante);
      envioIniciadoRef.current = true;
    }
    return { website, formChallenge: valor?.token ?? null };
  }, [cargar]);

  return { prepararProteccion };
}

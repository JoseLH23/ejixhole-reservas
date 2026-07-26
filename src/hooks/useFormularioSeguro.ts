import * as React from "react";

import { publicoApi } from "@/api/publico";
import type { FormChallengeResponse } from "@/types/publico";

const pausa = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, ms)));

export function useFormularioSeguro() {
  const valorRef = React.useRef<FormChallengeResponse | null>(null);
  const cargaRef = React.useRef<Promise<FormChallengeResponse | null> | null>(null);
  const envioIniciadoRef = React.useRef(false);

  const cargar = React.useCallback(async () => {
    const actual = valorRef.current;
    const vigente = actual && new Date(actual.expires_at).getTime() > Date.now();
    if (actual && (envioIniciadoRef.current || vigente)) return actual;
    valorRef.current = null;

    if (!cargaRef.current) {
      cargaRef.current = publicoApi.getFormChallenge().then(
        (nuevo) => {
          valorRef.current = nuevo;
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
    if (valor) {
      const listoEn = new Date(valor.issued_at).getTime() + valor.minimum_wait_seconds * 1000;
      if (listoEn > Date.now()) await pausa(listoEn - Date.now());
      envioIniciadoRef.current = true;
    }
    return { website, formChallenge: valor?.token ?? null };
  }, [cargar]);

  return { prepararProteccion };
}

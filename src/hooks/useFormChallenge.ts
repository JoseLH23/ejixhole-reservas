import * as React from "react";

import { publicoApi } from "@/api/publico";
import type { FormChallengeResponse } from "@/types/publico";

function pausa(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

export function useFormChallenge() {
  const challengeRef = React.useRef<FormChallengeResponse | null>(null);
  const cargaRef = React.useRef<Promise<FormChallengeResponse | null> | null>(null);

  const cargar = React.useCallback(async () => {
    if (challengeRef.current) return challengeRef.current;
    if (!cargaRef.current) {
      cargaRef.current = publicoApi.getFormChallenge().then(
        (challenge) => {
          challengeRef.current = challenge;
          return challenge;
        },
        () => null
      );
    }
    return cargaRef.current;
  }, []);

  React.useEffect(() => {
    void cargar();
  }, [cargar]);

  const prepararProteccion = React.useCallback(async (website: string) => {
    const challenge = await cargar();
    if (challenge) {
      const listoEn = new Date(challenge.issued_at).getTime() + challenge.minimum_wait_seconds * 1000;
      if (listoEn > Date.now()) await pausa(listoEn - Date.now());
    }
    return { website, formChallenge: challenge?.token ?? null };
  }, [cargar]);

  return { prepararProteccion };
}

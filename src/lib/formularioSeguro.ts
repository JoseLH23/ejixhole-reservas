import { apiClient } from "@/api/client";
import { obtenerPublicClientId } from "@/lib/publicClientId";
import type { FormChallengeResponse } from "@/types/formChallenge";

const porIdempotencia = new Map<string, FormChallengeResponse>();
let disponible: FormChallengeResponse | null = null;
let carga: Promise<FormChallengeResponse> | null = null;

const pausa = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, ms)));
const vigente = (value: FormChallengeResponse) => new Date(value.expires_at).getTime() > Date.now();

async function cargar(): Promise<FormChallengeResponse> {
  if (disponible && vigente(disponible)) return disponible;
  disponible = null;
  if (!carga) {
    carga = apiClient
      .get<FormChallengeResponse>("/publico/form-challenge", {
        headers: {
          "Cache-Control": "no-store",
          "X-Public-Client": obtenerPublicClientId(),
        },
      })
      .then(({ data }) => {
        disponible = data;
        carga = null;
        return data;
      })
      .catch((error) => {
        carga = null;
        throw error;
      });
  }
  return carga;
}

export async function prepararFormularioSeguro(idempotencyKey: string): Promise<string> {
  const anterior = porIdempotencia.get(idempotencyKey);
  if (anterior && vigente(anterior)) return anterior.token;
  if (anterior) porIdempotencia.delete(idempotencyKey);

  const challenge = await cargar();
  const listoEn = new Date(challenge.issued_at).getTime() + challenge.minimum_wait_seconds * 1000;
  if (listoEn > Date.now()) await pausa(listoEn - Date.now());

  porIdempotencia.set(idempotencyKey, challenge);
  disponible = null;
  return challenge.token;
}

export function confirmarFormularioSeguro(idempotencyKey: string): void {
  porIdempotencia.delete(idempotencyKey);
  void cargar().catch(() => undefined);
}

export function precargarFormularioSeguro(): void {
  void cargar().catch(() => undefined);
}

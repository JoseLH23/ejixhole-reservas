/**
 * AL-04 (auditoría de seguridad 13/jul/2026): genera una clave real
 * de idempotencia para proteger contra doble clic/doble envío al
 * crear una solicitud de reservación desde el portal público — la
 * operación que la auditoría señaló como más urgente (pública, sin
 * autenticación, en un formulario que la gente llena desde el
 * celular con conexión lenta).
 *
 * crypto.randomUUID() es nativo del navegador — no se agrega ninguna
 * librería nueva solo para esto.
 */
export function generarIdempotencyKey(): string {
  return crypto.randomUUID();
}

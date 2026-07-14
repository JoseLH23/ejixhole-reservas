# CLAUDE.md — Ejixhole Reservas (Portal Público)

Contexto persistente para Claude Code en este repo.

## Qué es esto

Portal público de reservaciones de **EjiXhole** (parque ecoturístico real). React + Vite + TypeScript. **Sin login, lo usan visitantes reales** desde el celular — es el punto de entrada de ingresos reales del negocio, trátalo con ese cuidado. Bilingüe (`src/i18n/`).

Consume el mismo backend que `ejixhole-frontend` (repo hermano, panel interno) — `Ejixhole-Backend`, repo separado.

## Entorno

- Windows + PowerShell, no bash.
- **`VITE_API_URL` es obligatoria en producción** — si falta, la app falla fuerte al cargar (a propósito, ver `src/api/client.ts`; antes caía en silencio a `localhost:8000` y el portal quedaba roto sin ningún error visible). En desarrollo local sin la variable, sí cae a `localhost:8000`.

## Comandos reales

```powershell
npm install
npm run dev        # localhost:5174 típicamente
npx tsc -b
npm run build       # requiere VITE_API_URL seteada si vas a probar el build de producción
```

## Flujo real (wizard de reservación)

`ReservaContext` guarda el estado del wizard **solo en memoria de React** — recargar la página o cerrarla borra el progreso (deuda técnica conocida, ME-10 de la auditoría — pendiente migrar a `sessionStorage` versionado).

Pasos reales: elegir tipo de reservación (entrada/camping/hospedaje) → fechas/personas → datos de contacto → confirmación. La creación real es `publicoApi.crearReservacion()` en `src/api/publico.ts`, contra `POST /publico/reservaciones` del backend.

## Convenciones reales — sigue el patrón existente

- **Idempotency-Key real** al crear la reservación (`src/lib/idempotencyKey.ts`) — es la operación pública más sensible a doble clic/doble envío de todo el ecosistema (conexión lenta desde celular + botón sin deshabilitar a tiempo = doble reservación real). Si tocas ese flujo, no quites esto.
- **Timeout real de 15s** en el cliente HTTP — una cotización o reserva no debe quedar "colgada" indefinidamente.
- El botón de enviar ya se deshabilita con `disabled={enviando}` mientras la petición está en curso — mantenlo.
- Nunca inventes un número de personas/fecha límite sin confirmar contra el backend real — la disponibilidad la valida el servidor, no el frontend (el frontend puede pre-validar para UX, pero el backend es la fuente de verdad final).

## Reglas de trabajo

1. Este es el flujo que genera ingresos reales — cualquier cambio al wizard de reservación se prueba de punta a punta antes de darlo por bueno, no solo `tsc -b` limpio.
2. No agregues textos nuevos sin pasar por `src/i18n/` (es bilingüe de verdad, no lo rompas con strings sueltos en un solo idioma).
3. Nunca borres funcionalidad existente sin decir explícitamente qué y por qué.
4. Si el cambio también necesita algo del backend, dilo explícito — no asumas que el backend ya lo soporta.

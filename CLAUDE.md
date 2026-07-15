# CLAUDE.md — Ejixhole Reservas (Portal Público)

Contexto persistente para Claude Code en este repo.

## Qué es esto

Portal público de reservaciones de **EjiXhole** (parque ecoturístico real). React + Vite + TypeScript. **Sin login, lo usan visitantes reales** desde el celular — es el punto de entrada de ingresos reales del negocio, trátalo con ese cuidado. Bilingüe (`src/i18n/`).

Consume el mismo backend que `ejixhole-frontend` (repo hermano, panel interno) — `C-Ejixhole-Backend`, repo separado.

## Objetivo de producto

Este portal es el vendedor digital de EjiXhole: debe resolver dudas frecuentes, generar confianza y convertir interés de campañas de MindHigh en solicitudes de reservación. No es una demo ni una plantilla para terceros.

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

`ReservaContext` persiste en `sessionStorage` únicamente el progreso **no sensible** del wizard: tipo, fechas, personas, unidad y opción de combi. La entrada está versionada, expira después de 2 horas y se elimina al confirmar o reiniciar. Nombre, correo, teléfono y notas nunca se guardan en storage.

Pasos reales: elegir tipo de reservación (entrada/camping/hospedaje) → fechas/personas → datos de contacto → confirmación. La creación real es `publicoApi.crearReservacion()` en `src/api/publico.ts`, contra `POST /publico/reservaciones` del backend.

## Convenciones reales — sigue el patrón existente

- **Idempotency-Key real** al crear la reservación (`src/lib/idempotencyKey.ts`) — es la operación pública más sensible a doble clic, timeout y reintento de todo el ecosistema.
- La clave permanece estable ante timeout, error de red o error de respuesta incierta. **Solo se renueva después de éxito confirmado.** El backend libera la clave cuando la operación falla realmente y conserva la respuesta cuando terminó; cambiarla en `catch` puede volver a crear una reservación que ya fue guardada.
- **Timeout real de 15s** en el cliente HTTP — una cotización o reserva no debe quedar "colgada" indefinidamente.
- El botón de enviar se deshabilita con `disabled={enviando}` mientras la petición está en curso — mantenlo.
- Nunca inventes un número de personas, precio o fecha límite sin confirmar contra el backend real. La disponibilidad y el total los valida el servidor; el frontend puede prevalidar para UX, pero el backend es la fuente de verdad final.
- Cualquier header HTTP nuevo enviado por el navegador debe agregarse también al contrato CORS del backend y probarse mediante preflight real.

## Reglas de trabajo

1. Este es el flujo que genera ingresos reales — cualquier cambio al wizard se prueba de punta a punta antes de darlo por bueno, no solo con `tsc -b`.
2. No agregues textos nuevos sin pasar por `src/i18n/` (es bilingüe de verdad, no lo rompas con strings sueltos en un solo idioma).
3. Nunca borres funcionalidad existente sin decir explícitamente qué y por qué.
4. Si el cambio también necesita algo del backend, dilo explícitamente y revisa el contrato cross-repo; no asumas que el backend ya lo soporta.
5. No trabajes directamente en `main`: rama, PR, CI verde y prueba del preview antes de fusionar.

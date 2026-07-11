# EjiXhole — Sitio público de reservaciones

Proyecto nuevo y separado del sistema interno (Experience OS). Sin
login — lo usa cualquier visitante para consultar el parque y
reservar entrada, camping o hospedaje.

## Cómo correrlo

```bash
npm install
cp .env.example .env
# Edita .env si tu backend no corre en localhost:8000
npm run dev
```

Corre en `http://localhost:5174` (puerto distinto al frontend interno,
que usa 5173 — así puedes tener los 2 abiertos a la vez).

**Requisito:** el backend (`Ejixhole-Backend`) debe estar corriendo,
con la migración `0004_usuario_id_opcional` aplicada y el catálogo
cargado (`python -m scripts.seed_catalogo_publico`).

## Qué construí

- **Inicio** (`/`): presentación del parque, clima real (pronóstico
  real ≤16 días, promedio histórico real más allá de eso), catálogo
  de las 12 actividades informativas (real, desde el backend), aviso
  de comida, mapa real de cómo llegar.
- **Reservar, 3 pasos guiados** (`/reservar` → `/reservar/datos` →
  `/reservar/confirmacion`): tipo + fechas + personas (con
  disponibilidad real en vivo si es hospedaje, y precio real vía
  `/publico/cotizar`) → datos de contacto → confirmación con los
  datos reales de la respuesta del backend.
- **Español/Inglés** completo, cambiable desde el encabezado.

## Decisiones que quiero que sepas

1. **El mapa busca por nombre del negocio** ("Parque Ecoturístico
   EjiXhole, El Naranjo, San Luis Potosí"), no por una coordenada fija
   — si ya tienen ficha en Google Maps (como vi en su Facebook),
   debería apuntar directo ahí. Si prefieres una coordenada GPS exacta
   del parque, dámela y la fijo en `src/components/inicio/MapaComoLlegar.tsx`.
2. **El clima usa Open-Meteo** (gratis, sin necesidad de cuenta ni
   contraseña) — no es parte del backend de EjiXhole, es una conexión
   directa del sitio hacia un servicio externo real.
3. **El total nunca se calcula en el frontend** — siempre se pide al
   backend (`/publico/cotizar`), para que nunca se desincronice del
   precio real si algún día cambian precios desde Servicios.
4. **Verifiqué manualmente cada import y cada clave de traducción**
   contra el código real (no pude instalar dependencias para correr
   `tsc` de verdad — mismo bloqueo de red que en el proyecto interno).
   Confirmé: 0 imports rotos, 0 claves de traducción faltantes, ES/EN
   con las mismas claves entre sí.

## Antes de publicar en producción

- Configura `VITE_API_URL` en el `.env` de producción, apuntando al
  dominio real del backend (no `localhost`).
- El backend ya tiene `https://reservas.ejixhole.com` permitido en
  CORS — si el dominio final es otro, avísame para actualizarlo.
- Actualiza los precios de las 12 actividades informativas desde el
  módulo Servicios (siguen en $0.00 con "PRECIO PENDIENTE" si no lo
  has hecho).

## Estructura

```
src/
  api/          client.ts, publico.ts (llamadas reales al backend), clima.ts (Open-Meteo)
  types/        publico.ts (refleja los schemas reales del backend)
  i18n/         es.json, en.json, index.ts
  context/      ReservaContext.tsx (estado del asistente de 3 pasos)
  router/       AppRouter.tsx
  pages/        InicioPage, ReservarTipoFechasPage, ReservarDatosPage, ConfirmacionPage, NotFoundPage
  components/
    layout/     Header, Footer, Layout
    inicio/     Hero, ActividadesInformativas, AvisoComida, MapaComoLlegar, ClimaWidget
    reservar/   WizardSteps
```

## Cómo probarlo

1. `npm run dev`, abre `http://localhost:5174`.
2. Confirma que el clima carga (revisa la consola del navegador si no — puede ser que Open-Meteo esté temporalmente lento).
3. Confirma que las actividades informativas cargan (deben ser 12, sin precio visible en las que sigan en $0.00).
4. Botón "Reservar" → elige "Camping" → llena fechas y personas → debe aparecer un total real calculado por el backend.
5. Elige "Habitación o cabaña" → elige una unidad → cambia fechas → confirma que "Disponible"/"No disponible" responde de verdad (pruébalo reservando la misma unidad dos veces con fechas que se traslapen).
6. Completa el formulario de contacto → envía → debes ver la confirmación con folio real.
7. Verifica en tu sistema interno (módulo Reservaciones) que la solicitud aparece ahí, en estado "pendiente".
8. Cambia el idioma a EN con el botón del encabezado y repite un par de pasos para confirmar que todo traduce.

## Backend

No se tocó nada nuevo del backend en este mensaje más allá de lo ya
entregado (`cotizar`, CORS) — este proyecto es 100% frontend nuevo.

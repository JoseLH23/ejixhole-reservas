import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  construirPayloadReserva,
  crearControlIdempotencia,
} from "../src/lib/reservaPayload.ts";

const leer = (ruta) => readFile(new URL(`../${ruta}`, import.meta.url), "utf8");

const estadoCompleto = {
  tipoReservacion: "camping",
  fechaLlegada: "2026-08-10",
  fechaSalida: "2026-08-12",
  numPersonas: 3,
  unidadHospedajeId: null,
};

const contacto = {
  nombreCompleto: "Cliente Prueba",
  email: "prueba@example.com",
  telefono: "4441234567",
  notas: "Llegamos por la tarde",
  quiereCombi: false,
};

test("construye el payload público con el contrato exacto del backend", () => {
  assert.deepEqual(construirPayloadReserva(estadoCompleto, contacto), {
    nombre_completo: "Cliente Prueba",
    email: "prueba@example.com",
    telefono: "4441234567",
    tipo_reservacion: "camping",
    fecha_llegada: "2026-08-10",
    fecha_salida: "2026-08-12",
    num_personas: 3,
    unidad_hospedaje_id: null,
    notas: "Llegamos por la tarde",
    website: "",
  });
});

test("agrega la solicitud de combi sin perder las notas del visitante", () => {
  const payload = construirPayloadReserva(estadoCompleto, {
    ...contacto,
    quiereCombi: true,
  });

  assert.equal(
    payload.notas,
    "Llegamos por la tarde\n\n[Solicita información de transporte en combi]"
  );
});

test("impide enviar un wizard incompleto", () => {
  assert.throws(
    () => construirPayloadReserva({ ...estadoCompleto, fechaSalida: null }, contacto),
    /tipo y fechas completas/
  );
});

test("un timeout conserva la misma Idempotency-Key y el éxito la renueva", () => {
  const claves = ["clave-uno", "clave-dos"];
  const control = crearControlIdempotencia(() => claves.shift() ?? "clave-extra");

  assert.equal(control.actual(), "clave-uno");
  assert.equal(control.actual(), "clave-uno");
  control.confirmarExito();
  assert.equal(control.actual(), "clave-dos");
});

test("el portal conserva cotización, disponibilidad y creación pública", async () => {
  const api = await leer("src/api/publico.ts");
  const paginaFechas = await leer("src/pages/ReservarTipoFechasPage.tsx");
  const paginaDatos = await leer("src/pages/ReservarDatosPage.tsx");

  assert.match(api, /"\/publico\/cotizar"/);
  assert.match(api, /"\/publico\/disponibilidad"/);
  assert.match(api, /"\/publico\/reservaciones"/);
  assert.match(api, /"Idempotency-Key"/);

  assert.match(
    paginaFechas,
    /bloqueo\.fecha_inicio < fechaSalida && bloqueo\.fecha_fin >= fechaLlegada/
  );
  assert.match(paginaDatos, /disabled=\{enviando\}/);
  assert.match(paginaDatos, /idempotenciaRef\.current\.actual\(\)/);
  assert.match(paginaDatos, /idempotenciaRef\.current\.confirmarExito\(\)/);
  assert.match(paginaDatos, /register\("website"\)/);
  assert.match(paginaDatos, /tabIndex=\{-1\}/);
});

test("el wizard muestra progreso y permite recuperarse de errores", async () => {
  const [pasos, inicio, datos, confirmacion, i18n] = await Promise.all([
    leer("src/components/reservar/WizardSteps.tsx"),
    leer("src/pages/ReservarInicioPage.tsx"),
    leer("src/pages/ReservarDatosPage.tsx"),
    leer("src/pages/ConfirmacionPage.tsx"),
    leer("src/i18n/index.ts"),
  ]);

  assert.match(pasos, /aria-current=\{actual \? "step"/);
  assert.match(pasos, /reservar\.progreso/);

  assert.match(inicio, /isError/);
  assert.match(inicio, /onClick=\{\(\) => refetch\(\)\}/);
  assert.match(inicio, /reservar\.errorConsultaCierresTitulo/);

  assert.match(datos, /role="alert"/);
  assert.match(datos, /reservar\.resumenSolicitud/);
  assert.match(datos, /errorEnvio \? t\("reservar\.reintentarEnvio"\)/);
  assert.match(datos, /autoComplete="name"/);
  assert.match(datos, /autoComplete="email"/);
  assert.match(datos, /autoComplete="tel"/);

  assert.match(confirmacion, /confirmacion\.queSigue/);
  assert.match(confirmacion, /confirmacion\.guardarFolio/);
  assert.match(i18n, /reservaUxEs/);
  assert.match(i18n, /reservaUxEn/);
});

test("el portal limita imágenes iniciales y mide rendimiento real", async () => {
  const [hero, galeria, lightbox, inicio, metricas, html, vercel, workflow, paquete] = await Promise.all([
    leer("src/components/inicio/Hero.tsx"),
    leer("src/components/inicio/Galeria.tsx"),
    leer("src/components/shared/Lightbox.tsx"),
    leer("src/pages/InicioPage.tsx"),
    leer("src/lib/webVitals.ts"),
    leer("index.html"),
    leer("vercel.json"),
    leer(".github/workflows/reservas-ci.yml"),
    leer("package.json"),
  ]);

  assert.doesNotMatch(hero, /\/gallery\/rio-2\.jpg/);
  assert.match(hero, /fetchPriority="high"/);
  assert.match(html, /rel="preload" href="\/gallery\/hero-principal\.jpg"/);

  assert.match(galeria, /const LIMITE_INICIAL = 8/);
  assert.match(galeria, /loading="lazy"/);
  assert.match(galeria, /fetchPriority="low"/);
  assert.match(galeria, /galeria\.mostrarMas/);
  assert.match(lightbox, /const imagen = new Image\(\)/);

  assert.match(inicio, /IntersectionObserver/);
  assert.match(inicio, /rootMargin: "600px 0px"/);
  assert.match(inicio, /lazy\(\(\) => import/);

  assert.match(metricas, /largest-contentful-paint/);
  assert.match(metricas, /layout-shift/);
  assert.match(metricas, /"event"/);
  assert.match(metricas, /ejixhole:web-vital/);

  assert.match(vercel, /stale-while-revalidate=604800/);
  assert.match(workflow, /npm run performance:check/);
  assert.match(paquete, /"performance:check"/);
});

test("sessionStorage guarda progreso, nunca datos personales", async () => {
  const contexto = await leer("src/context/ReservaContext.tsx");
  const inicioPick = contexto.indexOf("type EstadoPersistible");
  const finPick = contexto.indexOf(">;", inicioPick);
  const definicionPersistible = contexto.slice(inicioPick, finPick);

  assert.match(contexto, /ejixhole:reserva-wizard/);
  assert.match(contexto, /sessionStorage\.removeItem/);
  assert.doesNotMatch(definicionPersistible, /nombreCompleto|email|telefono|notas/);
});

test("la accesibilidad crítica queda protegida por código y Chromium", async () => {
  const [layout, header, datos, calendario, lightbox, resenas, workflow, auditoria] = await Promise.all([
    leer("src/components/layout/Layout.tsx"),
    leer("src/components/layout/Header.tsx"),
    leer("src/pages/ReservarDatosPage.tsx"),
    leer("src/components/reservar/CalendarioFecha.tsx"),
    leer("src/components/shared/Lightbox.tsx"),
    leer("src/components/inicio/ResenasSection.tsx"),
    leer(".github/workflows/e2e.yml"),
    leer("e2e/accesibilidad.spec.mjs"),
  ]);

  assert.match(layout, /href="#contenido-principal"/);
  assert.match(layout, /tabIndex=\{-1\}/);
  assert.match(header, /document\.documentElement\.lang/);
  assert.match(header, /aria-pressed=\{i18n\.language/);
  assert.match(datos, /htmlFor="nombre-completo"/);
  assert.match(datos, /aria-describedby=\{errors\.email/);
  assert.match(calendario, /aria-controls=\{abierto/);
  assert.match(calendario, /event\.key !== "Escape"/);
  assert.match(lightbox, /focoAnterior\?\.focus\(\)/);
  assert.match(lightbox, /e\.key === "Tab"/);
  assert.match(resenas, /className="flex h-6 w-6 items-center justify-center/);
  assert.match(workflow, /@axe-core\/playwright@4\.12\.1/);
  assert.match(auditoria, /wcag22aa/);
});

test("el smoke desplegado ejecuta React y detecta configuración faltante", async () => {
  const [workflow, smoke] = await Promise.all([
    leer(".github/workflows/post-deploy-smoke.yml"),
    leer("scripts/post-deploy-smoke.mjs"),
  ]);

  assert.match(workflow, /node scripts\/post-deploy-smoke\.mjs/);
  assert.match(workflow, /playwright install --with-deps chromium/);
  assert.match(workflow, /if: always\(\)/);
  assert.match(smoke, /page\.on\("pageerror"/);
  assert.match(smoke, /VITE_API_URL/);
  assert.match(smoke, /\/reservar/);
  assert.match(smoke, /Visita de un día/);
});

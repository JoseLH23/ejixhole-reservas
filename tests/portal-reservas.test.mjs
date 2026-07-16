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

test("sessionStorage guarda progreso, nunca datos personales", async () => {
  const contexto = await leer("src/context/ReservaContext.tsx");
  const inicioPick = contexto.indexOf("type EstadoPersistible");
  const finPick = contexto.indexOf(">;", inicioPick);
  const definicionPersistible = contexto.slice(inicioPick, finPick);

  assert.match(contexto, /ejixhole:reserva-wizard/);
  assert.match(contexto, /sessionStorage\.removeItem/);
  assert.doesNotMatch(definicionPersistible, /nombreCompleto|email|telefono|notas/);
});

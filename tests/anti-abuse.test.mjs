import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { construirPayloadReserva } from "../src/lib/reservaPayload.ts";

const estado = {
  tipoReservacion: "entrada",
  fechaLlegada: "2026-07-20",
  fechaSalida: "2026-07-20",
  numPersonas: 2,
  unidadHospedajeId: null,
};

const datos = {
  nombreCompleto: "Persona de prueba",
  email: "persona@example.test",
  telefono: "4440000000",
  notas: "",
  website: "",
  quiereCombi: false,
};

test("el payload incluye honeypot y desafío sin alterar la reservación", () => {
  const payload = construirPayloadReserva(estado, datos, {
    website: "",
    formChallenge: "challenge-test-value",
  });

  assert.equal(payload.website, "");
  assert.equal(payload.form_challenge, "challenge-test-value");
  assert.equal(payload.tipo_reservacion, "entrada");
  assert.equal(payload.num_personas, 2);
});

test("sin desafío conserva el honeypot existente", () => {
  const payload = construirPayloadReserva(estado, datos);
  assert.equal(payload.website, "");
  assert.equal("form_challenge" in payload, false);
});

test("la pantalla carga el desafío, mantiene idempotencia y oculta el honeypot", async () => {
  const page = await readFile("src/pages/ReservarDatosPage.tsx", "utf8");
  const api = await readFile("src/api/publico.ts", "utf8");
  const client = await readFile("src/api/client.ts", "utf8");

  assert.match(api, /\/publico\/form-challenge/);
  assert.match(client, /X-Public-Client/);
  assert.match(page, /register\("website"\)/);
  assert.match(page, /prepararProteccion/);
  assert.match(page, /idempotenciaRef\.current\.actual\(\)/);
  assert.match(page, /aria-hidden="true"/);
});

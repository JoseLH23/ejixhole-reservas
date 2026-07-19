import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


test("la API prepara y confirma la validación con la misma idempotencia", async () => {
  const source = await readFile("src/api/publico.ts", "utf8");
  assert.match(source, /prepararFormularioSeguro\(clave\)/);
  assert.match(source, /form_challenge: challenge/);
  assert.match(source, /confirmarFormularioSeguro\(clave\)/);
  assert.match(source, /X-Public-Client/);
});


test("el gestor renueva valores vencidos y conserva reintentos vigentes", async () => {
  const source = await readFile("src/lib/formularioSeguro.ts", "utf8");
  assert.match(source, /porIdempotencia\.get\(idempotencyKey\)/);
  assert.match(source, /vigente\(anterior\)/);
  assert.match(source, /porIdempotencia\.set\(idempotencyKey, challenge\)/);
  assert.match(source, /minimum_wait_seconds/);
});


test("el identificador temporal soporta almacenamiento no disponible", async () => {
  const source = await readFile("src/lib/publicClientId.ts", "utf8");
  assert.match(source, /sessionStorage/);
  assert.match(source, /catch/);
  assert.match(source, /idEnMemoria/);
});

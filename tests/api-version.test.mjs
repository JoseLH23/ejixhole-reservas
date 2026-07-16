import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cliente = readFileSync(new URL("../src/api/client.ts", import.meta.url), "utf8");
const ejemploEnv = readFileSync(new URL("../.env.example", import.meta.url), "utf8");

test("el portal agrega /api/v1 a la URL configurada", () => {
  assert.match(cliente, /function conApiV1/);
  assert.match(cliente, /\/api\/v1/);
  assert.match(cliente, /VITE_API_URL/);
});

test("no duplica el prefijo cuando la URL ya contiene api v1", () => {
  assert.match(cliente, /endsWith\("\/api\/v1"\)/);
});

test("el ejemplo de entorno conserva únicamente el dominio base", () => {
  assert.match(ejemploEnv, /VITE_API_URL=http:\/\/localhost:8000/);
  assert.match(ejemploEnv, /agrega automáticamente \/api\/v1/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const configuracion = JSON.parse(
  await readFile(new URL("../vercel.json", import.meta.url), "utf8")
);

const cabecerasGlobales = new Map(
  configuracion.headers
    .find((regla) => regla.source === "/(.*)")
    .headers.map(({ key, value }) => [key, value])
);

test("el portal aplica cabeceras defensivas en todas las rutas", () => {
  assert.equal(cabecerasGlobales.get("X-Content-Type-Options"), "nosniff");
  assert.equal(cabecerasGlobales.get("X-Frame-Options"), "DENY");
  assert.equal(cabecerasGlobales.get("Cross-Origin-Opener-Policy"), "same-origin");
  assert.match(cabecerasGlobales.get("Strict-Transport-Security"), /includeSubDomains/);
  assert.match(cabecerasGlobales.get("Permissions-Policy"), /geolocation=\(\)/);
});

test("la CSP permite únicamente los proveedores públicos necesarios", () => {
  const csp = cabecerasGlobales.get("Content-Security-Policy");
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /https:\/\/api\.open-meteo\.com/);
  assert.match(csp, /https:\/\/archive-api\.open-meteo\.com/);
  assert.match(csp, /frame-src https:\/\/www\.google\.com https:\/\/maps\.google\.com/);
  assert.match(csp, /https:\/\/c-ejixhole-backend\.onrender\.com/);
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
});

test("conserva las políticas de caché diferenciadas", () => {
  const assets = configuracion.headers.find((regla) => regla.source === "/assets/(.*)");
  const gallery = configuracion.headers.find((regla) => regla.source === "/gallery/(.*)");
  assert.match(assets.headers[0].value, /immutable/);
  assert.match(gallery.headers[0].value, /stale-while-revalidate/);
});

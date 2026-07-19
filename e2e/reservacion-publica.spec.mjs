import { expect, test } from "@playwright/test";

const seleccionPersistida = {
  version: 1,
  expiraEn: Date.now() + 60 * 60 * 1000,
  estado: {
    tipoReservacion: "entrada",
    fechaLlegada: "2026-08-10",
    fechaSalida: "2026-08-10",
    numPersonas: 2,
    unidadHospedajeId: null,
    quiereCombi: false,
  },
};

const respuestaExitosa = {
  id: 321,
  tipo_reservacion: "entrada",
  fecha_llegada: "2026-08-10",
  fecha_salida: "2026-08-10",
  num_personas: 2,
  total: "500.00",
  estado: "pendiente",
  fecha_creacion: "2026-07-18T12:00:00Z",
  mensaje: "Solicitud recibida correctamente.",
};

const desafio = {
  token: "challenge-e2e-value",
  issued_at: "2026-07-18T12:00:00Z",
  expires_at: "2099-01-01T00:00:00Z",
  minimum_wait_seconds: 0,
  enforcement_mode: "monitor",
};

async function prepararPasoDeDatos(page) {
  await page.route("**/api/v1/publico/form-challenge", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(desafio),
    });
  });
  await page.addInitScript((seleccion) => {
    sessionStorage.setItem("ejixhole:reserva-wizard", JSON.stringify(seleccion));
  }, seleccionPersistida);
  await page.goto("/reservar/datos");
  await expect(page.getByRole("heading", { name: "Revisa tu visita y comparte tus datos" })).toBeVisible();
  await expect(page.locator('input[name="website"]')).toHaveCount(1);
  await expect(page.locator('input[name="website"]')).toHaveAttribute("tabindex", "-1");
}

async function completarFormulario(page) {
  await page.locator('input[autocomplete="name"]').fill("Visitante de Prueba");
  await page.locator('input[autocomplete="email"]').fill("visitante@example.com");
  await page.locator('input[autocomplete="tel"]').fill("4441234567");
  await page.locator("textarea").fill("Llegaremos por la mañana");
}

test("confirma una solicitud y envía desafío e idempotencia", async ({ page }) => {
  let solicitud;
  let idempotencyKey;
  let publicClientId;

  await page.route("**/api/v1/publico/reservaciones", async (route) => {
    solicitud = route.request().postDataJSON();
    const headers = route.request().headers();
    idempotencyKey = headers["idempotency-key"];
    publicClientId = headers["x-public-client"];
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(respuestaExitosa),
    });
  });

  await prepararPasoDeDatos(page);
  await completarFormulario(page);
  await page.getByRole("button", { name: "Enviar solicitud" }).click();

  await expect(page).toHaveURL(/\/reservar\/confirmacion$/);
  await expect(page.getByText("#321", { exact: true })).toBeVisible();
  expect(idempotencyKey).toMatch(/^[0-9a-f-]{36}$/i);
  expect(publicClientId).toBeTruthy();
  expect(solicitud).toEqual({
    nombre_completo: "Visitante de Prueba",
    email: "visitante@example.com",
    telefono: "4441234567",
    tipo_reservacion: "entrada",
    fecha_llegada: "2026-08-10",
    fecha_salida: "2026-08-10",
    num_personas: 2,
    unidad_hospedaje_id: null,
    notas: "Llegaremos por la mañana",
    website: "",
    form_challenge: "challenge-e2e-value",
  });
});

test("un fallo temporal conserva clave, cuerpo y desafío", async ({ page }) => {
  const claves = [];
  const cuerpos = [];
  let intentos = 0;

  await page.route("**/api/v1/publico/reservaciones", async (route) => {
    intentos += 1;
    claves.push(route.request().headers()["idempotency-key"]);
    cuerpos.push(route.request().postDataJSON());

    if (intentos === 1) {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ detail: "Servicio temporalmente no disponible" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(respuestaExitosa),
    });
  });

  await prepararPasoDeDatos(page);
  await completarFormulario(page);
  await page.getByRole("button", { name: "Enviar solicitud" }).click();

  await expect(page.getByRole("alert")).toContainText("Servicio temporalmente no disponible");
  await page.getByRole("button", { name: "Reintentar envío" }).click();

  await expect(page).toHaveURL(/\/reservar\/confirmacion$/);
  expect(claves).toHaveLength(2);
  expect(claves[0]).toBeTruthy();
  expect(claves[1]).toBe(claves[0]);
  expect(cuerpos[1]).toEqual(cuerpos[0]);
});

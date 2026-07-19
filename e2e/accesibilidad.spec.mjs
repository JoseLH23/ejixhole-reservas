import AxeBuilder from "@axe-core/playwright";
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

async function simularApiPublica(page) {
  await page.route("**/api/v1/publico/**", async (route) => {
    const url = new URL(route.request().url());
    let body = [];

    if (url.pathname.endsWith("/disponibilidad")) body = { disponible: true };
    if (url.pathname.endsWith("/cotizar")) {
      body = {
        noches: 0,
        total: "100.00",
        desglose: [{ concepto: "Entrada", detalle: "2 personas", subtotal: "100.00" }],
      };
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

async function esperarInterfaz(page) {
  await expect(page.locator("main")).toBeVisible();
  await page.waitForTimeout(250);
}

async function esperarSinViolaciones(page) {
  const resultado = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(resultado.violations).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await simularApiPublica(page);
});

for (const ruta of ["/", "/reservar"]) {
  test(`cumple WCAG automatizable en ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    await esperarInterfaz(page);
    await esperarSinViolaciones(page);
  });
}

test("cumple WCAG automatizable en el formulario de contacto", async ({ page }) => {
  await page.addInitScript((seleccion) => {
    sessionStorage.setItem("ejixhole:reserva-wizard", JSON.stringify(seleccion));
  }, seleccionPersistida);

  await page.goto("/reservar/datos");
  await esperarInterfaz(page);
  await esperarSinViolaciones(page);
});

test("el calendario abierto conserva semántica accesible", async ({ page }) => {
  await page.goto("/reservar");
  await page.getByRole("button", { name: /Entrada/ }).click();
  const calendario = page.getByRole("button", { name: /Fecha/ }).last();
  await calendario.click();

  await expect(page.getByRole("dialog", { name: /Fecha/ })).toBeVisible();
  await esperarSinViolaciones(page);
  await page.keyboard.press("Escape");
  await expect(calendario).toBeFocused();
});

test("el visor atrapa y restaura el foco", async ({ page }) => {
  await page.goto("/");
  for (let paso = 0; paso < 7; paso += 1) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(100);
  }

  const foto = page.getByRole("button", { name: /Descubre la magia de EjiXhole/ }).first();
  await foto.scrollIntoViewIfNeeded();
  await foto.focus();
  await foto.click();

  const cerrar = page.getByRole("button", { name: "Cerrar" });
  await expect(cerrar).toBeFocused();
  await esperarSinViolaciones(page);
  await page.keyboard.press("Escape");
  await expect(foto).toBeFocused();
});

test("permite saltar al contenido usando sólo teclado", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const salto = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(salto).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("expone el idioma activo a lectores de pantalla", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "English" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
});

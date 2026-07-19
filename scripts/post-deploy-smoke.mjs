import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");

if (!baseUrl || !baseUrl.startsWith("https://")) {
  throw new Error("BASE_URL debe ser una URL HTTPS sin ruta adicional.");
}

const artifactsDir = "smoke-artifacts";
await mkdir(artifactsDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const runtimeErrors = [];

page.on("pageerror", (error) => runtimeErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") runtimeErrors.push(message.text());
});

async function guardarEvidencia(nombre) {
  await Promise.all([
    page.screenshot({ path: `${artifactsDir}/${nombre}.png`, fullPage: true }),
    writeFile(`${artifactsDir}/${nombre}.html`, await page.content()),
    writeFile(
      `${artifactsDir}/runtime-errors.json`,
      JSON.stringify(runtimeErrors, null, 2)
    ),
  ]);
}

try {
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "EjiXhole", exact: true }).waitFor();

  await page.goto(`${baseUrl}/reservar`, { waitUntil: "domcontentloaded" });
  await page
    .getByRole("heading", { name: "¿Qué te gustaría reservar?", exact: true })
    .waitFor();
  await page
    .getByRole("button", {
      name: "Visita de un día Entrada al parque, sin hospedaje",
      exact: true,
    })
    .waitFor();

  const startupErrors = runtimeErrors.filter((message) =>
    /VITE_API_URL|portal no puede arrancar|uncaught/i.test(message)
  );

  if (startupErrors.length > 0) {
    throw new Error(`Errores de arranque detectados: ${startupErrors.join(" | ")}`);
  }

  await guardarEvidencia("reservar-ok");
  console.log(`Smoke real aprobado: ${baseUrl}/reservar`);
} catch (error) {
  await guardarEvidencia("smoke-fallido");
  throw error;
} finally {
  await browser.close();
}

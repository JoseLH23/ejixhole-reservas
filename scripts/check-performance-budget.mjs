import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const DIRECTORIO = new URL("../dist/assets/", import.meta.url);
const KB = 1024;
const LIMITES = {
  javascriptIndividual: 650 * KB,
  javascriptTotal: 1_500 * KB,
  cssIndividual: 200 * KB,
};

const archivos = await readdir(DIRECTORIO);
const resultados = await Promise.all(
  archivos.map(async (archivo) => ({
    archivo,
    bytes: (await stat(join(DIRECTORIO.pathname, archivo))).size,
    extension: extname(archivo),
  }))
);

const javascript = resultados.filter((archivo) => archivo.extension === ".js");
const estilos = resultados.filter((archivo) => archivo.extension === ".css");
const errores = [];

for (const archivo of javascript) {
  if (archivo.bytes > LIMITES.javascriptIndividual) {
    errores.push(`${archivo.archivo}: ${(archivo.bytes / KB).toFixed(1)} KB de JavaScript`);
  }
}

for (const archivo of estilos) {
  if (archivo.bytes > LIMITES.cssIndividual) {
    errores.push(`${archivo.archivo}: ${(archivo.bytes / KB).toFixed(1)} KB de CSS`);
  }
}

const javascriptTotal = javascript.reduce((total, archivo) => total + archivo.bytes, 0);
if (javascriptTotal > LIMITES.javascriptTotal) {
  errores.push(`JavaScript total: ${(javascriptTotal / KB).toFixed(1)} KB`);
}

console.log("Presupuesto de rendimiento:");
console.log(`- JavaScript total: ${(javascriptTotal / KB).toFixed(1)} KB`);
console.log(`- Chunks JavaScript: ${javascript.length}`);
console.log(`- Hojas CSS: ${estilos.length}`);

if (errores.length > 0) {
  console.error("\nSe excedió el presupuesto de rendimiento:");
  errores.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Presupuesto de rendimiento aprobado.");

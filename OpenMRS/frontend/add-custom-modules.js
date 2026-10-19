/*
 * Agrega al SPA ensamblado los módulos frontend propios de la residencia
 * (los que no están publicados en npm y por eso "openmrs assemble" no puede bajar).
 *
 * Cada subcarpeta de custom-modules/ contiene el dist/ compilado de un módulo
 * más un module.json con: { "name": "@scope/esm-xxx-app", "entry": "archivo.js", "version": "x.y.z" }
 *
 * Para cada uno:
 *   1. copia sus archivos a <spa>/<carpeta>/
 *   2. lo registra en importmap.json (para que el navegador lo cargue)
 *   3. registra su routes.json en routes.registry.json (páginas y extensiones)
 *
 * Uso: node add-custom-modules.js ./spa
 */
const fs = require('fs');
const path = require('path');

const spaDir = process.argv[2] || './spa';
const modulesDir = path.join(__dirname, 'custom-modules');

const importmapPath = path.join(spaDir, 'importmap.json');
const routesPath = path.join(spaDir, 'routes.registry.json');
const importmap = JSON.parse(fs.readFileSync(importmapPath, 'utf8'));
const routesFile = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
// Las versiones nuevas del ensamblador guardan las rutas dentro de una clave "routes";
// las viejas, en la raíz del archivo. Soportamos ambos formatos.
const routes = routesFile.routes && typeof routesFile.routes === 'object' ? routesFile.routes : routesFile;

for (const carpeta of fs.readdirSync(modulesDir)) {
  const origen = path.join(modulesDir, carpeta);
  const manifestPath = path.join(origen, 'module.json');
  if (!fs.statSync(origen).isDirectory() || !fs.existsSync(manifestPath)) {
    continue;
  }

  const { name, entry, version } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!fs.existsSync(path.join(origen, entry))) {
    throw new Error(`[${carpeta}] falta ${entry}: ¿copiaste el dist/ compilado?`);
  }

  const destinoNombre = `${carpeta}-${version}`;
  fs.cpSync(origen, path.join(spaDir, destinoNombre), { recursive: true });

  importmap.imports[name] = `./${destinoNombre}/${entry}`;

  const routesJson = path.join(origen, 'routes.json');
  if (fs.existsSync(routesJson)) {
    routes[name] = { ...JSON.parse(fs.readFileSync(routesJson, 'utf8')), version };
  }

  console.log(`Módulo propio agregado: ${name}@${version} -> ${destinoNombre}/${entry}`);
}

fs.writeFileSync(importmapPath, JSON.stringify(importmap, null, 2));
fs.writeFileSync(routesPath, JSON.stringify(routesFile));

// La imagen oficial trae versiones precomprimidas (.gz/.br) de estos archivos y nginx se las
// sirve a los navegadores en lugar del .json. Como quedaron desactualizadas, las borramos:
// nginx pasa a servir el .json modificado (y el gateway lo comprime al vuelo).
for (const archivo of [importmapPath, routesPath]) {
  for (const ext of ['.gz', '.br']) {
    if (fs.existsSync(archivo + ext)) {
      fs.unlinkSync(archivo + ext);
      console.log(`Borrado ${path.basename(archivo + ext)} (versión comprimida desactualizada)`);
    }
  }
}

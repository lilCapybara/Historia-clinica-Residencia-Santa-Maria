# Historia clínica — Residencia Santa María (OpenMRS 3)

Implementación de OpenMRS 3 (O3) como sistema de historia clínica de la Residencia Santa María y el Hogar San José. Es parte de la Práctica Profesional Supervisada (PPS) de la TUDAI (UNICEN).

Parte del [distro de referencia de OpenMRS 3](https://github.com/openmrs/openmrs-distro-referenceapplication) y le suma módulos y configuración propios. Lo que este README no cubre (SSL con Let's Encrypt, Grafana, etc.) sigue siendo lo que documenta ese repositorio.

## Qué se agregó respecto al distro de referencia

- **Módulo de protocolos** (frontend `esm-protocolos-app` + módulo backend `.omod`): consulta y gestión de protocolos institucionales.
- **Módulo de control de glucemia** (frontend `@openmrs/esm-glycemia-control-app`): registro de HGT y sugerencia de corrección con insulina. Código y documentación: [openmrs-esm-glycemia-control-app](https://github.com/lilCapybara/openmrs-esm-glycemia-control-app).
- **Metadatos propios** cargados con Initializer: conceptos, tipos de encuentro, ubicaciones de ambas sedes, roles y formularios.
- **Imágenes propias** de frontend y backend, que parten de las oficiales (`3.7.x`) y les agregan lo anterior.
- **Base de datos externa** (MySQL en un servidor propio) en lugar del contenedor `db` del distro.
- Idioma por defecto del frontend: español (`SPA_DEFAULT_LOCALE: es`).

## Estructura

Todo lo relevante está dentro de `OpenMRS/` (la carpeta que contiene el `docker-compose.yml`):

```
OpenMRS/
├── docker-compose.yml            # servicios base: gateway, frontend, backend
├── docker-compose.override.yml   # se aplica solo: construye las imágenes propias
├── residencia/
│   ├── backend.Dockerfile        # imagen oficial + .omod propios + distro/configuration
│   └── frontend.Dockerfile       # imagen oficial + módulos frontend propios
├── custom-modules/               # módulos backend propios (.omod)
├── distro/configuration/         # configuración de Initializer (ver más abajo)
├── frontend/
│   ├── custom-modules/           # módulos frontend propios (dist compilado + module.json)
│   ├── add-custom-modules.js     # los registra en el SPA durante el build
│   ├── residencia-config.json    # configuración del frontend (se monta como volumen)
│   ├── spa-assemble-config.json  # módulos oficiales que trae el SPA
│   └── config-core_demo.json
└── gateway/                      # nginx que une frontend y backend
```

## Primer arranque

Requisitos: Docker con Docker Compose.

1. Crear `OpenMRS/.env` (no se commitea) con los datos de la base:

   ```
   DB_HOST=...
   DB_NAME=...
   DB_USER=...
   DB_PASSWORD=...
   ```

2. Levantar todo, desde la carpeta `OpenMRS/`:

   ```
   docker compose up -d --build
   ```

   El `docker-compose.override.yml` se aplica automáticamente. El backend tarda unos 8 minutos en arrancar; seguirlo con `docker compose logs -f backend` hasta ver `Server startup in [...] milliseconds`.

3. Abrir `http://localhost/openmrs/spa` (UI nueva) o `http://localhost/openmrs` (UI legacy).

## Metadatos (Initializer)

La configuración vive en `distro/configuration/` y **viaja dentro de la imagen del backend**: `residencia/backend.Dockerfile` la copia a `/openmrs/distribution/openmrs_config`, y al arrancar OpenMRS la copia a `/openmrs/data/configuration` y Initializer la aplica.

Para cambiar un metadato: editar el CSV, y reconstruir y reiniciar el backend.

```
docker compose build backend
docker compose up -d backend
```

Dominios en uso: `ampathforms`, `concepts`, `encountertypes`, `globalproperties`, `locations`, `roles`.

### Registros de los que dependen otros módulos

No cambiar estos UUID sin actualizar `frontend/residencia-config.json`:

| Tipo | Nombre | UUID |
|---|---|---|
| Concepto | Glycemia level | `4e396ca3-e951-4c6c-92e9-683ba642169e` |
| Tipo de encuentro | Glycemia Reading | `50ce5a90-e738-47c3-bd5b-68464615ce62` |
| Ubicación | Recepcion | `fc6cecb2-9ab1-4974-988e-295f59000f50` |
| Ubicación | Residencia Santa Maria | `93918ee3-4cb9-49b3-8897-c480b1d895e3` |
| Ubicación | Hogar San Jose | `875bdd70-9e33-4fb7-87d0-840c53c925e6` |
| Rol | Enfermeria | `2131cdbb-0fae-4a3f-8eb2-1e58c65d0610` |
| Rol | Protocolos: Consulta | `dddd3112-fc0c-496a-a4cc-563cd312396b` |
| Rol | Protocolos: Gestion | `1db127bf-ae44-4e71-8720-93b83af0cf00` |

### Ubicaciones

Hay dos sedes, Hogar San Jose y Residencia Santa Maria, cada una con sus ubicaciones internas (habitaciones, comedor, patios, etc.), definidas en `distro/configuration/locations/residencia/locations.csv`.

- Las ubicaciones internas se llaman `<Sede> - <nombre>` (por ejemplo `Residencia Santa Maria - Habitación 1`), porque varios nombres se repiten entre sedes.
- Las dos sedes y `Recepcion` tienen la etiqueta *Login Location* (son las que se eligen al iniciar sesión). Las internas no la tienen.
- Los UUID de las ubicaciones internas se generaron una sola vez y están fijos en el CSV. No regenerar el archivo con otros UUID.

### Roles

Definidos en `distro/configuration/roles/roles.csv`:

- `Protocolos: Consulta` y `Protocolos: Gestion`.
- `Enfermeria`: **hoy es una copia fiel del rol creado a mano, con 334 privilegios, e incluye permisos administrativos** (alta de usuarios, cambio de contraseñas, gestión de roles, borrado de encuentros). Ver pendientes.

## Frontend y módulos propios

El SPA se arma en dos pasos:

1. La imagen oficial (`openmrs-reference-application-3-frontend`) trae los módulos de `spa-assemble-config.json`.
2. `residencia/frontend.Dockerfile` ejecuta `frontend/add-custom-modules.js`, que toma cada carpeta de `frontend/custom-modules/`, la copia al SPA y la registra en `importmap.json` y `routes.registry.json`.

Cada carpeta de `frontend/custom-modules/` contiene el `dist/` compilado del módulo y un `module.json`:

```json
{ "name": "@openmrs/esm-glycemia-control-app", "entry": "openmrs-esm-glycemia-control-app.js", "version": "4.0.0" }
```

El `name` tiene que ser idéntico al nombre del paquete del módulo. Procedimiento para actualizar un módulo: ver `frontend/custom-modules/README.md`; después, reconstruir el frontend:

```
docker compose build frontend
docker compose up -d --force-recreate frontend
```

`frontend/residencia-config.json` se monta como volumen: cambiarlo **no** requiere reconstruir, alcanza con recargar el navegador (refresco forzado, `Ctrl+Shift+R`). Ahí está la configuración de cada módulo, por ejemplo los UUID de glucemia.

El navegador cachea el `importmap` con un service worker: si un módulo nuevo no aparece, probar en una ventana de incógnito o limpiar los datos del sitio.

## Problemas conocidos

**El backend se reinicia en bucle con `cp: cannot create regular file ... Permission denied`.**
Quedaron archivos con dueño `root` en el volumen `openmrs-data` (por haber copiado cosas con `docker cp`). El backend corre con un usuario sin privilegios y no puede sobrescribirlos. No usar `docker cp` para la configuración: todo entra por la imagen. Para repararlo:

```
docker compose stop backend
docker compose run --rm --no-deps --user root --entrypoint sh backend -c "chown -R --reference=/openmrs/data /openmrs/data/configuration"
docker compose up -d backend
```

**Un módulo frontend no aparece después de reconstruir.**
Comprobar que el contenedor se recreó (`--force-recreate`), verificar que figura en `http://localhost/openmrs/spa/importmap.json` y limpiar la caché del navegador.

## Pendientes

- Reducir los privilegios del rol `Enfermeria` a los que realmente necesita (hoy puede administrar usuarios y roles).
- Probar una instalación desde cero (base y volumen vacíos) contra una base de descarte, para confirmar que todos los metadatos se crean solos.
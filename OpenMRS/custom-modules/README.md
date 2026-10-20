# Módulos backend propios

`.omod` de módulos de la residencia que no están publicados en Maven.
El `Dockerfile` los copia a `/openmrs/distribution/openmrs_modules/`, así que se instalan
solos al levantar el backend.

## Actualizar un módulo (ej. protocolos)

    cd C:\Users\sebas\IdeaProjects\openmrs-module-protocolos
    mvn clean install
    Copy-Item omod\target\protocolos-*.omod "..\PPS Residencia Santa Maria\OpenMRS\custom-modules\" -Force

Si cambia la versión, borrar el .omod viejo de esta carpeta (no puede haber dos versiones del mismo módulo).

Repo del código fuente: https://github.com/lilCapybara/openmrs-module-protocolos

## Actualizar el módulo de glucemia

    cd C:\Users\sebas\IdeaProjects\Glycemia-module
    yarn build
    # borrar todo menos module.json y copiar el dist nuevo:
    Get-ChildItem "..\PPS Residencia Santa Maria\OpenMRS\frontend\custom-modules\esm-glycemia-control-app" -Exclude module.json | Remove-Item -Recurse -Force
    Copy-Item dist\* "..\PPS Residencia Santa Maria\OpenMRS\frontend\custom-modules\esm-glycemia-control-app" -Recurse
    # reconstruir y recrear el frontend (desde la carpeta OpenMRS):
    docker compose build frontend
    docker compose up -d --force-recreate frontend

Si cambia la versión en package.json, actualizarla también en module.json.
El `name` de module.json tiene que ser igual al de package.json (`@openmrs/esm-glycemia-control-app`).

Repo del código fuente: https://github.com/lilCapybara/openmrs-esm-glycemia-control-app
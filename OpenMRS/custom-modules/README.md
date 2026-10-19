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

# Módulos frontend propios

Módulos O3 de la residencia que no están en npm. `add-custom-modules.js` los agrega
al SPA durante el build de la imagen del frontend.

Cada carpeta tiene el contenido de `dist/` del módulo compilado más un `module.json`.

## Actualizar un módulo (ej. protocolos)

    cd C:\Users\sebas\IdeaProjects\openmrs-esm-protocols-frontend-app
    corepack yarn build
    # borrar todo menos module.json y copiar el dist nuevo:
    Get-ChildItem "..\PPS Residencia Santa Maria\OpenMRS\frontend\custom-modules\esm-protocolos-app" -Exclude module.json | Remove-Item -Recurse -Force
    Copy-Item dist\* "..\PPS Residencia Santa Maria\OpenMRS\frontend\custom-modules\esm-protocolos-app" -Recurse

Si cambia la versión en package.json, actualizarla también en module.json.

Repo del código fuente: https://github.com/lilCapybara/openmrs-esm-protocols-frontend-app

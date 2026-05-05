La refference application esta ubicada dentro de la carpeta OpenMRS.

Los formularios que se vayan creando están guardados en OpenMRS->distro->configuration->ampathforms

Para levantar la app por primera vez:

Ubicado en OpenMRS---> docker compose up

Link de ingreso a la pagina de OpenMRS: http://localhost/openmrs/spa

Para agregar nuevos modulos se debe clonar este dentro del repositorio a la misma altura que la carpeta OpenMRS.

Tras agregar un nuevo modulo se debe instalar Yarn en el y ejecutarlo

-yarn install

-yarn start --backend http://localhost	(Permite editar la navegación de la pagina, pero no el frontend)

Para correr un microfrontend en especifico y editarlo se usa:

-yarn start --sources 'packages/esm-patient-<insert-package-name>-app'

Por ejemplo, para Paquete vitals seria:

-yarn start --sources 'packages/esm-patient-vitals-app'

Esto permite editar el frontend correspondiente a ese paquete en tiempo real.

Estos paquetes se encuentra en la carpeta packages dentro de cada modulo.


Para que un modulo clonado al repo de github sea accesible, es necesario convertirlo de submodulo a una carpeta normal:

# Eliminar el submodule de OpenMRS
git rm --cached OpenMRS
git rm --cached openmrs-esm-patient-chart

# Ahora agregar los archivos normalmente
git add OpenMRS/
git add openmrs-esm-patient-chart/

ó directamente git add .

git commit -m "Convertir submódulos a carpetas normales"
git push origin main

En caso de que en las carpetas de modulos haya una carpeta .git, hay que borrarlas:
rm -rf OpenMRS/.git
rm -rf openmrs-esm-patient-chart/.git

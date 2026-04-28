La refference application esta ubicada dentro de la carpeta OpenMRS.

Los formularios que se vayan creando están guardados en OpenMRS->distro->configuration->ampathforms

Para levantar la app por primera vez:

Ubicado en OpenMRS---> docker compose up

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

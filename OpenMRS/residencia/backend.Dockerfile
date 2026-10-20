# Backend de la residencia = imagen oficial de OpenMRS + modulos propios.
# No recompila la distribucion: parte exactamente de la imagen que ya se usaba.
ARG BACKEND_TAG=3.7.x-no-demo
FROM openmrs/openmrs-reference-application-3-backend:${BACKEND_TAG}

# Modulos backend propios (no publicados en Maven): ver custom-modules/README.md
# Al arrancar, OpenMRS copia todo lo de openmrs_modules a /openmrs/data/modules y lo instala.
COPY custom-modules/*.omod /openmrs/distribution/openmrs_modules/

# Configuracion de Initializer propia (conceptos, tipos de encuentro, roles, ubicaciones,
# formularios, etc.). Se suma a la que trae la imagen oficial: al arrancar, OpenMRS copia
# /openmrs/distribution/openmrs_config a /openmrs/data/configuration y Initializer la aplica.
COPY distro/configuration/ /openmrs/distribution/openmrs_config/
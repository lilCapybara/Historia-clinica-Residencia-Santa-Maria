# Frontend de la residencia = imagen oficial de OpenMRS + modulos frontend propios.
ARG TAG=3.7.x

FROM openmrs/openmrs-reference-application-3-frontend:${TAG} AS oficial

# Etapa auxiliar con Node: registra los modulos en importmap.json y routes.registry.json
FROM node:22-alpine AS patch
COPY --from=oficial /usr/share/nginx/html /spa
COPY frontend/custom-modules /work/custom-modules
COPY frontend/add-custom-modules.js /work/
RUN node /work/add-custom-modules.js /spa

FROM oficial
# Vaciar antes de copiar: COPY no borra archivos y sobrevivirian los .gz/.br viejos
RUN rm -rf /usr/share/nginx/html/*
COPY --from=patch /spa /usr/share/nginx/html

# Etapa 1: Construcción

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Profundización en Despliegue en Next.js](01-profundizacion-en-despliegue-en-nextjs.md) | [🏠 Inicio](../index.md) | [Etapa 2: Producción (solo lo necesario) ▶](03-etapa-2-produccion-solo-lo-necesario.md) |

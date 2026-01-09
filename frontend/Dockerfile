# ================================
# Frontend OVP - Dockerfile
# Sistema de Orientación Vocacional
# ================================

# ================================
# Etapa 1: Build
# ================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (necesarias para build) ignorando plataforma
RUN npm install --legacy-peer-deps --force && \
  npm cache clean --force

# Copiar código fuente
COPY . .

# Build de producción (sin variables de entorno específicas)
# Las variables se inyectarán en runtime
RUN npm run build

# ================================
# Etapa 2: Producción con Nginx
# ================================
FROM nginx:alpine AS production

# Instalar gettext para envsubst y wget para healthcheck
RUN apk add --no-cache gettext wget

# Copiar archivos build desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de entrada personalizado
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Variables de entorno con valores por defecto
ENV VITE_API_URL=http://localhost:5000/api
ENV VITE_PORT=3000

# Exponer puerto 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Usar script de entrada personalizado
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

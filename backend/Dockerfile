# ================================
# Backend OVP - Dockerfile
# Sistema de Orientación Vocacional
# ================================

# Etapa 1: Dependencias
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# ================================
# Etapa 2: Producción
FROM node:20-alpine AS production

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Copiar dependencias desde etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY --chown=nodeuser:nodejs . .

# Cambiar a usuario no-root
USER nodeuser

# ================================
# Variables de Entorno
# ================================
# Servidor (valores por defecto seguros)
ENV PORT=5000
ENV NODE_ENV=production

# Base de Datos PostgreSQL (host y puerto con defaults)
ENV DB_HOST=database
ENV DB_PORT=5432
ENV DB_NAME=ovp_database
ENV DB_USER=postgres

# CORS Configuration (valores por defecto)
ENV CORS_ORIGIN=*

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicio
CMD ["node", "server.js"]

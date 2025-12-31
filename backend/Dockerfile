# Dockerfile para Backend (Node.js + Express)
FROM node:20-alpine

# Instalar Python y pip para el servicio ML
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-numpy \
    py3-pandas \
    && ln -sf python3 /usr/bin/python

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias de Node.js
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm ci --only=production

# Copiar requirements.txt del ML
COPY ml/requirements.txt ./ml/

# Instalar dependencias de Python
RUN pip3 install --no-cache-dir -r ml/requirements.txt --break-system-packages

# Copiar código fuente
COPY . .

# Copiar y dar permisos al script de entrada
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exponer puerto del backend
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar el script de entrada
ENTRYPOINT ["docker-entrypoint.sh"]

# Comando para ejecutar
CMD ["node", "server.js"]

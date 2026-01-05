# 🐳 Guía de Despliegue a Docker Hub - Sistema OVP

## ✅ Verificación de la Arquitectura Actual

### Estado de Dockerización ✓

Tu proyecto **YA ESTÁ CORRECTAMENTE DOCKERIZADO** según las instrucciones que te dieron:

#### ✅ **Backend Dockerizado** - `backend/Dockerfile`
- **✓** Copia todos los archivos del backend incluyendo el modelo ML
- **✓** Incluye archivos del modelo:
  - `modelo_random_forest.pkl`
  - `modelo_rf_17carreras.pkl`
  - `label_encoder.pkl`
  - `label_encoder_17carreras.pkl`
- **✓** Instala dependencias de Node.js
- **✓** Instala dependencias de Python (scikit-learn, pandas, numpy)
- **✓** Configura correctamente el puerto 3000
- **✓** Include health check

#### ✅ **Frontend Dockerizado** - `Dockerfile`
- **✓** Multi-stage build para optimizar tamaño
- **✓** Etapa de build con Node.js 20
- **✓** Etapa de producción con Nginx
- **✓** Configuración nginx personalizada
- **✓** Expone puerto 80

#### ✅ **Docker Compose Configurado** - `docker-compose.yml`
- **✓** Tres servicios: database, backend, frontend
- **✓** Puertos configurados correctamente:
  - Frontend: 80
  - Backend: 3000
  - Database: 5432
- **✓** Conexión entre servicios configurada (red ovp-network)
- **✓** Variables de entorno correctas
- **✓** Health checks implementados
- **✓** Volúmenes persistentes para BD y modelos ML

#### ✅ **Archivos .dockerignore Correctos**
- **✓** Frontend excluye node_modules, tests, archivos innecesarios
- **✓** Backend excluye archivos de desarrollo y tests
- **✓** ML excluye archivos de cache de Python

---

## 🚀 PASOS PARA SUBIR A DOCKER HUB

### Paso 1: Crear Cuenta en Docker Hub (si no la tienes)

1. Ve a https://hub.docker.com/
2. Crea una cuenta gratuita
3. Anota tu **username** (lo usarás en todos los comandos)

### Paso 2: Iniciar Sesión en Docker Hub desde tu Terminal

```powershell
# Iniciar sesión en Docker Hub
docker login

# Te pedirá:
# Username: tu-username
# Password: tu-password
```

### Paso 3: Construir las Imágenes con Etiquetas de Docker Hub

**Importante**: Reemplaza `TU_USERNAME` con tu nombre de usuario de Docker Hub.

```powershell
# Construir imagen del BACKEND
docker build -t jcgonzaga2/ovp-backend:latest ./backend

# Construir imagen del FRONTEND
docker build -t jcgonzaga2/ovp-frontend:latest .
```

**Ejemplo con username "kewo"**:
```powershell
docker build -t kewo/ovp-backend:latest ./backend
docker build -t kewo/ovp-frontend:latest .
```

### Paso 4: Verificar que las Imágenes se Crearon Correctamente

```powershell
# Ver todas las imágenes
docker images

# Deberías ver algo como:
# REPOSITORY              TAG       IMAGE ID       CREATED         SIZE
# kewo/ovp-backend       latest    abc123...      2 minutes ago   450MB
# kewo/ovp-frontend      latest    def456...      1 minute ago    25MB
```

### Paso 5: Subir las Imágenes a Docker Hub

```powershell
# Subir BACKEND
docker push jcgonzaga2/ovp-backend:latest

# Subir FRONTEND
docker push jcgonzaga2/ovp-frontend:latest
```

**Ejemplo**:
```powershell
docker push kewo/ovp-backend:latest
docker push kewo/ovp-frontend:latest
```

### Paso 6: Verificar en Docker Hub

1. Ve a https://hub.docker.com/
2. Inicia sesión
3. Verás tus repositorios: `ovp-backend` y `ovp-frontend`
4. Haz clic en cada uno para ver los detalles

---

## 📝 Crear Docker Compose para Producción (usando imágenes de Docker Hub)

Una vez subidas las imágenes, puedes crear un `docker-compose.prod.yml` para usar las imágenes de Docker Hub:

### Archivo `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  database:
    image: postgres:16-alpine
    container_name: ovp-database
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME:-ovp_database}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8"
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ovp-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API (desde Docker Hub)
  backend:
    image: TU_USERNAME/ovp-backend:latest  # ← Cambiar por tu username
    container_name: ovp-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      PORT: ${BACKEND_PORT:-3000}
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: ${DB_NAME:-ovp_database}
      DB_USER: ${DB_USER:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:-postgres}
      JWT_SECRET: ${JWT_SECRET:-change-this-secret-in-production}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-24h}
      INIT_DB: ${INIT_DB:-true}
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - ovp-network

  # Frontend (desde Docker Hub)
  frontend:
    image: TU_USERNAME/ovp-frontend:latest  # ← Cambiar por tu username
    container_name: ovp-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:3000}
    ports:
      - "${FRONTEND_PORT:-80}:80"
    depends_on:
      - backend
    networks:
      - ovp-network

networks:
  ovp-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

### Uso del Docker Compose de Producción

```powershell
# Levantar servicios usando imágenes de Docker Hub
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Detener servicios
docker-compose -f docker-compose.prod.yml down
```

---

## 🏷️ Versionado de Imágenes (Opcional pero Recomendado)

### Crear Versiones Específicas

En lugar de solo usar `latest`, puedes crear versiones:

```powershell
# Backend con versión 1.0.0
docker build -t TU_USERNAME/ovp-backend:1.0.0 ./backend
docker build -t TU_USERNAME/ovp-backend:latest ./backend

# Frontend con versión 1.0.0
docker build -t TU_USERNAME/ovp-frontend:1.0.0 .
docker build -t TU_USERNAME/ovp-frontend:latest .

# Subir ambas versiones
docker push TU_USERNAME/ovp-backend:1.0.0
docker push TU_USERNAME/ovp-backend:latest
docker push TU_USERNAME/ovp-frontend:1.0.0
docker push TU_USERNAME/ovp-frontend:latest
```

### Ventajas del Versionado
- Puedes hacer rollback a versiones anteriores
- Control sobre qué versión se despliega
- Mejor trazabilidad de cambios

---

## 🔄 Workflow Completo para Actualizaciones

Cuando hagas cambios en tu código:

```powershell
# 1. Hacer cambios en el código

# 2. Construir nueva versión
docker build -t TU_USERNAME/ovp-backend:1.1.0 ./backend
docker build -t TU_USERNAME/ovp-backend:latest ./backend

# 3. Subir a Docker Hub
docker push TU_USERNAME/ovp-backend:1.1.0
docker push TU_USERNAME/ovp-backend:latest

# 4. Actualizar en producción
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Tamaños Aproximados de las Imágenes

- **Backend**: ~450-500MB (incluye Node.js + Python + modelos ML)
- **Frontend**: ~25-30MB (solo archivos estáticos + Nginx)
- **Database**: ~250MB (PostgreSQL Alpine)

---

## 🔒 Hacer Repositorios Privados (Opcional)

Si no quieres que tu código sea público:

1. Ve a Docker Hub
2. Entra a tu repositorio (ej: `ovp-backend`)
3. Ve a Settings → Make Private
4. Confirma

**Nota**: Cuentas gratuitas de Docker Hub permiten 1 repositorio privado.

---

## 🎯 Resumen Ejecutivo

Tu proyecto **está correctamente configurado**:

✅ **Backend dockerizado** con todos los archivos ML incluidos  
✅ **Frontend dockerizado** con build optimizado  
✅ **Docker Compose** con puertos y conexiones correctas  
✅ **Archivos .dockerignore** correctos  
✅ **Health checks** implementados  
✅ **Script de inicialización** de base de datos  

**Solo necesitas ejecutar los comandos de los Pasos 2-5 para subir a Docker Hub.**

---

## 📞 Comandos Rápidos de Referencia

```powershell
# Login
docker login

# Build
docker build -t TU_USERNAME/ovp-backend:latest ./backend
docker build -t TU_USERNAME/ovp-frontend:latest .

# Push
docker push TU_USERNAME/ovp-backend:latest
docker push TU_USERNAME/ovp-frontend:latest

# Ver imágenes locales
docker images

# Ver imágenes en uso
docker ps

# Limpiar imágenes antiguas
docker image prune -a
```

---

## ⚠️ Notas Importantes

1. **Modelos ML**: Los archivos `.pkl` están incluidos en el backend y se subirán a Docker Hub
2. **Tamaño**: El backend es pesado (~450MB) debido a Python + modelos ML - esto es normal
3. **Variables de entorno**: Recuerda configurar `.env` correctamente en producción
4. **JWT_SECRET**: CAMBIA el secret en producción por uno seguro
5. **DB_PASSWORD**: USA una contraseña fuerte en producción
6. **Tiempo de subida**: Puede tardar varios minutos dependiendo de tu conexión

---

¿Listo para subir a Docker Hub? Solo ejecuta los comandos de los Pasos 2-5. 🚀

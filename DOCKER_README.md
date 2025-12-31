# Instrucciones para Docker - Sistema OVP

## 📋 Requisitos Previos
- Docker Engine 20.10 o superior
- Docker Compose 2.0 o superior
- 4GB de RAM disponible (recomendado)
- Puertos 80, 3000 y 5432 libres

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tus valores (IMPORTANTE: cambia JWT_SECRET y DB_PASSWORD)
notepad .env  # En Windows
nano .env     # En Linux/Mac
```

### 2. Construir y Levantar los Servicios
```bash
# Construir todas las imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

### 3. Acceder a la Aplicación
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Base de Datos**: localhost:5432

## 🏗️ Arquitectura de Contenedores

La aplicación está dividida en **3 contenedores**:

### Frontend (Nginx + React)
- **Puerto**: 80
- **Tecnología**: React + Vite + Nginx
- **Build**: Multi-stage (optimizado para producción)
- **Descripción**: Interfaz de usuario construida y servida por Nginx

### Backend (Node.js + Express + Python)
- **Puerto**: 3000
- **Tecnología**: Node.js 20 + Express + Python 3 + scikit-learn
- **Inicialización**: Ejecuta init-db automáticamente al iniciar
- **Descripción**: API REST y servicio ML integrado

### Base de Datos (PostgreSQL)
- **Puerto**: 5432
- **Versión**: PostgreSQL 16 Alpine
- **Persistencia**: Volume `postgres_data`
- **Descripción**: Almacenamiento de usuarios, preguntas y resultados

**Nota**: El servicio ML (Python) está **integrado en el contenedor del backend**, no es un contenedor separado. El backend ejecuta scripts de Python cuando necesita hacer predicciones.

## 📦 Comandos Útiles

### Gestión de Servicios
```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Borra la BD)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend

# Ver estado de los servicios
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f backend
```

### Desarrollo
```bash
# Reconstruir un servicio específico
docker-compose build --no-cache backend

# Ejecutar comando en un contenedor
docker-compose exec backend npm run test

# Acceder a la shell de un contenedor
docker-compose exec backend sh
docker-compose exec database psql -U postgres -d ovp_database
```

### Base de Datos
```bash
# Inicializar/Reinicializar la base de datos
docker-compose exec backend npm run init-db

# Hacer backup de la base de datos
docker-compose exec database pg_dump -U postgres ovp_database > backup.sql

# Restaurar backup
cat backup.sql | docker-compose exec -T database psql -U postgres ovp_database
```

### Debugging ML Service
```bash
# Ejecutar pruebas del modelo desde el backend
docker-compose exec backend python ml/test_predict.py

# Ver archivos del ML
docker-compose exec backend ls -la /app/ml

# Verificar que Python está instalado
docker-compose exec backend python --version

# Verificar dependencias de Python
docker-compose exec backend pip3 list
```

## 🔧 Configuración de Producción

### 1. Variables de Entorno Seguras
```env
DB_PASSWORD=una_contraseña_muy_segura_y_larga
JWT_SECRET=un_secreto_jwt_muy_largo_y_aleatorio_generado_con_openssl
NODE_ENV=production
```

### 2. Generar JWT_SECRET Seguro
```bash
# En Linux/Mac
openssl rand -base64 64

# En Windows PowerShell
$bytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### 3. Configurar Dominio y HTTPS
Para producción, modifica [nginx.conf](nginx.conf) y añade:
- Certificados SSL
- Redirección HTTP a HTTPS
- Tu dominio

## 🐛 Solución de Problemas

### El frontend no conecta con el backend
```bash
# Verificar que VITE_API_URL apunta correctamente
# En .env debería ser la URL pública del backend
VITE_API_URL=http://tu-dominio.com:3000
```

### Error de conexión a la base de datos
```bash
# Verificar que el servicio está corriendo
docker-compose ps database

# Ver logs de la base de datos
docker-compose logs database

# Esperar a que esté ready
docker-compose exec database pg_isready -U postgres
```

### El ML service no funciona
```bash
# Verificar que Python está disponible en el backend
docker-compose exec backend python --version

# Verificar dependencias instaladas
docker-compose exec backend pip3 list

# Verificar que existen los modelos
docker-compose exec backend ls -la /app/ml/

# Probar la predicción manualmente
docker-compose exec backend python ml/predict.py
```

### Limpiar y Empezar de Cero
```bash
# Detener todo
docker-compose down -v

# Limpiar imágenes antiguas
docker system prune -a

# Reconstruir y levantar
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Monitoreo

### Health Checks
```bash
# Backend health endpoint
curl http://localhost:3000/health

# Estado de todos los servicios
docker-compose ps
```

### Recursos
```bash
# Ver uso de recursos
docker stats

# Espacio usado por volúmenes
docker system df -v
```

## 🔒 Seguridad

- ✅ Cambia todas las contraseñas por defecto
- ✅ Usa JWT_SECRET único y seguro
- ✅ No expongas la base de datos públicamente (puerto 5432 solo local)
- ✅ Configura HTTPS en producción
- ✅ Actualiza las imágenes regularmente

## 📝 Notas

- Los volúmenes persisten los datos entre reinicios
- El backend espera a que la DB esté ready (healthcheck)
- El ML service es invocado por el backend cuando se necesita
- Los modelos ML se comparten entre backend y ml-service vía volume

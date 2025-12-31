# 🐳 Inicio Rápido - Docker

## Opción 1: Windows (PowerShell)

```powershell
# 1. Copiar variables de entorno
Copy-Item .env.example .env

# 2. Editar .env y cambiar las contraseñas
notepad .env

# 3. Construir y levantar servicios
.\docker.ps1 build
.\docker.ps1 up

# 4. Ver logs
.\docker.ps1 logs

# 5. Acceder a la aplicación
# Frontend: http://localhost
# Backend: http://localhost:3000
# Database: localhost:5432
```

### Comandos Útiles (Windows)
```powershell
.\docker.ps1 help           # Ver todos los comandos
.\docker.ps1 status         # Estado de servicios
.\docker.ps1 logs-backend   # Logs del backend
.\docker.ps1 shell-backend  # Acceder a shell del backend
.\docker.ps1 init-db        # Reinicializar base de datos
.\docker.ps1 backup         # Hacer backup
.\docker.ps1 down           # Detener todo
```

## Opción 2: Linux/Mac (Make)

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Editar .env y cambiar las contraseñas
nano .env

# 3. Construir y levantar servicios
make build
make up

# 4. Ver logs
make logs

# 5. Acceder a la aplicación
# Frontend: http://localhost
# Backend: http://localhost:3000
# Database: localhost:5432
```

### Comandos Útiles (Linux/Mac)
```bash
make help           # Ver todos los comandos
make status         # Estado de servicios
make logs-backend   # Logs del backend
make shell-backend  # Acceder a shell del backend
make init-db        # Reinicializar base de datos
make backup         # Hacer backup
make down           # Detener todo
```

## Opción 3: Docker Compose Directo

```bash
# 1. Copiar y editar .env
cp .env.example .env

# 2. Construir imágenes
docker-compose build

# 3. Levantar servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f

# 5. Detener
docker-compose down
```

## 🎯 Modo Desarrollo

Para desarrollo con hot-reload:

### Windows
```powershell
.\docker.ps1 dev
```

### Linux/Mac
```bash
make dev
```

### Docker Compose
```bash
docker-compose -f docker-compose.dev.yml up
```

## ⚠️ IMPORTANTE: Seguridad

Antes de usar en producción, **DEBES cambiar** en el archivo `.env`:

1. **DB_PASSWORD**: Contraseña segura para PostgreSQL
2. **JWT_SECRET**: String aleatorio de al menos 32 caracteres

### Generar JWT_SECRET seguro:

**Windows PowerShell:**
```powershell
$bytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Linux/Mac:**
```bash
openssl rand -base64 64
```

## 📊 Verificar que Todo Funciona

### Windows
```powershell
.\docker.ps1 health
```

### Linux/Mac
```bash
make health
```

### Manual
```bash
# Backend
curl http://localhost:3000/health

# Frontend
curl http://localhost/

# Database
docker-compose exec database pg_isready -U postgres
```

## 🐛 Solución de Problemas

### No se puede conectar a la base de datos
```bash
# Ver logs de la DB
docker-compose logs database

# Verificar que está corriendo
docker-compose ps database

# Reiniciar
docker-compose restart database
```

### El backend no inicia
```bash
# Ver logs
docker-compose logs backend

# Verificar variables de entorno
docker-compose exec backend env | grep DB

# Reconstruir
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Limpiar todo y empezar de cero
```bash
# Detener y eliminar volúmenes
docker-compose down -v

# Limpiar imágenes antiguas
docker system prune -af

# Reconstruir
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Documentación Completa

Ver [DOCKER_README.md](DOCKER_README.md) para documentación detallada.

## 🎉 ¡Listo!

Tu aplicación debería estar corriendo en:
- 🌐 **Frontend**: http://localhost
- 🔧 **Backend API**: http://localhost:3000
- 🗄️ **PostgreSQL**: localhost:5432

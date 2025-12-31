# FAQ y Troubleshooting - Docker OVP

## ❓ Preguntas Frecuentes

### ¿Por qué el ML está integrado en el backend y no es un contenedor separado?

El servicio ML es invocado bajo demanda por el backend mediante `spawn('python', ...)`. No es un servicio HTTP que corre constantemente, sino scripts de Python que se ejecutan cuando se necesita una predicción. Por lo tanto:

- ✅ **Más simple**: Un contenedor menos que mantener
- ✅ **Más eficiente**: No consume recursos cuando no se usa
- ✅ **Más rápido**: No hay overhead de red entre servicios
- ✅ **Más fácil de debuggear**: Todo en un mismo lugar

Si en el futuro necesitas escalar el ML independientemente, puedes separarlo en su propio servicio HTTP.

### ¿Cómo funciona la inicialización de la base de datos?

Al levantar los servicios por primera vez con `INIT_DB=true`:

1. El backend espera a que PostgreSQL esté ready (healthcheck)
2. El script `docker-entrypoint.sh` ejecuta `npm run init-db`
3. Se crean las tablas y se pueblan con datos iniciales
4. El servidor inicia normalmente

Para **reinicializar** la BD en cualquier momento:
```bash
.\docker.ps1 init-db  # Windows
make init-db          # Linux/Mac
```

### ¿Qué pasa con los datos cuando reinicio los contenedores?

Los datos **persisten** gracias a los volumes de Docker:
- `postgres_data`: Base de datos completa
- `ml_models`: Modelos ML entrenados

Para **eliminar** los datos:
```bash
docker-compose down -v  # ⚠️ CUIDADO: Borra todo
```

### ¿Cómo actualizo el código sin perder la base de datos?

```bash
# Detener servicios
docker-compose down

# Reconstruir solo lo que cambió
docker-compose build backend  # o frontend

# Levantar de nuevo
docker-compose up -d
```

Los volúmenes NO se tocan, solo los contenedores.

### ¿Puedo usar esto en producción?

Sí, pero **DEBES**:

1. ✅ Cambiar todas las contraseñas en `.env`
2. ✅ Generar un JWT_SECRET seguro
3. ✅ Configurar HTTPS en Nginx
4. ✅ No exponer el puerto 5432 públicamente
5. ✅ Usar `.env.production` en lugar de `.env.development`
6. ✅ Configurar backups automáticos de la BD
7. ✅ Monitorear logs y recursos

### ¿Cómo conecto desde fuera de Docker?

Los puertos están mapeados a tu localhost:

- **Frontend**: `http://localhost` (puerto 80)
- **Backend API**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`

Puedes usar cualquier cliente SQL para conectarte a PostgreSQL con las credenciales de tu `.env`.

---

## 🐛 Troubleshooting

### Error: "Port 80 is already in use"

Otro servicio está usando el puerto 80 (probablemente IIS o Apache).

**Solución 1**: Detener el otro servicio
```powershell
# Windows - Detener IIS
Stop-Service W3SVC
```

**Solución 2**: Cambiar el puerto del frontend
```bash
# En .env
FRONTEND_PORT=8080
```
Luego acceder a `http://localhost:8080`

### Error: "Port 3000 is already in use"

**Solución**: Cambiar puerto del backend en `.env`
```bash
BACKEND_PORT=3001
```

También actualiza `VITE_API_URL`:
```bash
VITE_API_URL=http://localhost:3001
```

### Error: "Port 5432 is already in use"

Tienes PostgreSQL instalado localmente.

**Solución 1**: Detener PostgreSQL local
```bash
# Windows
Stop-Service postgresql-x64-16

# Linux
sudo systemctl stop postgresql
```

**Solución 2**: Cambiar puerto de la BD
```bash
# En .env
DB_PORT=5433
```

### Error: "database does not exist"

El backend no pudo crear/inicializar la base de datos.

**Solución**:
```bash
# Ver logs
docker-compose logs database
docker-compose logs backend

# Reinicializar manualmente
docker-compose exec backend npm run init-db
```

### Error: "Python not found" o "ModuleNotFoundError"

Las dependencias de Python no se instalaron correctamente.

**Solución**:
```bash
# Reconstruir backend sin cache
docker-compose build --no-cache backend

# Verificar que Python está instalado
docker-compose exec backend python --version
docker-compose exec backend pip3 list
```

### Error: "Cannot connect to the Docker daemon"

Docker no está corriendo.

**Solución**:
- Windows: Iniciar Docker Desktop
- Linux: `sudo systemctl start docker`

### Los cambios en el código no se reflejan

Estás en modo **producción** donde el código se copia al build.

**Solución**: Usar modo desarrollo con hot-reload
```bash
.\docker.ps1 dev  # Windows
make dev          # Linux/Mac
```

O reconstruir manualmente:
```bash
docker-compose build backend
docker-compose up -d backend
```

### Frontend muestra "Cannot connect to server"

El frontend no puede comunicarse con el backend.

**Verificar**:
1. Backend está corriendo: `docker-compose ps backend`
2. Backend responde: `curl http://localhost:3000/health`
3. `VITE_API_URL` apunta correctamente (en `.env`)

**Solución**:
```bash
# Reconstruir frontend con la variable correcta
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Error: "permission denied" al ejecutar scripts

**Windows**: Habilitar ejecución de scripts PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Linux/Mac**: Dar permisos de ejecución
```bash
chmod +x docker.sh  # Si creas un script bash
```

### ML predictions fallan con "Model not found"

Los modelos ML no están disponibles.

**Verificar**:
```bash
# Ver archivos en /app/ml
docker-compose exec backend ls -la /app/ml

# Debe existir el modelo entrenado
docker-compose exec backend ls -la /app/ml/models
```

**Solución**: Asegúrate de que los modelos estén en `backend/ml/models/` antes de construir.

### Contenedor se reinicia constantemente (CrashLoopBackOff)

**Verificar logs**:
```bash
docker-compose logs backend
docker-compose logs database
```

**Causas comunes**:
1. Error en variables de entorno (revisar `.env`)
2. Base de datos no está ready (esperar más tiempo)
3. Error en el código (revisar logs)

**Solución**:
```bash
# Ver logs en tiempo real
docker-compose logs -f backend

# Acceder a shell para debuggear
docker-compose exec backend sh
```

### "Out of memory" o "No space left on device"

Docker se quedó sin recursos.

**Solución**:
```bash
# Limpiar imágenes y contenedores antiguos
docker system prune -af

# Ver espacio usado
docker system df

# Aumentar recursos en Docker Desktop (Settings > Resources)
```

### Health check always failing

El servicio no responde al health check en el tiempo esperado.

**Verificar**:
```bash
# Backend health
curl http://localhost:3000/health

# Database health
docker-compose exec database pg_isready -U postgres
```

**Solución**: Aumentar el timeout en `docker-compose.yml`:
```yaml
healthcheck:
  timeout: 10s  # Aumentar de 3s a 10s
  retries: 10   # Aumentar reintentos
```

### No puedo hacer backup: "No such file or directory"

El directorio `backups/` no existe.

**Solución**:
```bash
# Crear directorio
mkdir backups

# Intentar de nuevo
.\docker.ps1 backup  # Windows
make backup          # Linux/Mac
```

---

## 📊 Comandos de Diagnóstico

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Ver estado de contenedores
```bash
docker-compose ps
```

### Ver uso de recursos
```bash
docker stats
```

### Inspeccionar un contenedor
```bash
docker inspect ovp-backend
```

### Ver variables de entorno de un contenedor
```bash
docker-compose exec backend env
```

### Ver red de Docker
```bash
docker network inspect prototipo_ovp_ovp-network
```

### Ver volúmenes
```bash
docker volume ls
docker volume inspect prototipo_ovp_postgres_data
```

### Ejecutar comando en contenedor
```bash
docker-compose exec backend sh
docker-compose exec backend npm run test
docker-compose exec backend python ml/predict.py
```

---

## 🔍 Debugging Avanzado

### Acceder a PostgreSQL directamente
```bash
docker-compose exec database psql -U postgres -d ovp_database

# Dentro de psql:
\dt                    # Ver tablas
\d users               # Describir tabla
SELECT * FROM users;   # Consultar datos
```

### Ver archivos dentro del contenedor
```bash
docker-compose exec backend ls -la /app
docker-compose exec backend cat /app/.env
```

### Probar conexión a la base de datos desde el backend
```bash
docker-compose exec backend node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
  }
);
sequelize.authenticate()
  .then(() => console.log('Conexión exitosa'))
  .catch(err => console.error('Error:', err));
"
```

### Ver qué proceso está usando un puerto
```powershell
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

---

## 💡 Tips y Mejores Prácticas

### Desarrollo
- Usa `docker-compose.dev.yml` para development con hot-reload
- Monta volúmenes para ver cambios en tiempo real
- Usa `docker-compose logs -f` para monitorear

### Producción
- Cambia **todas** las contraseñas
- Usa HTTPS (certificado SSL en Nginx)
- No expongas puerto 5432 públicamente
- Configura backups automáticos
- Monitorea recursos con `docker stats`

### Performance
- Limpia imágenes antiguas regularmente: `docker system prune`
- Usa multi-stage builds (ya implementado en frontend)
- Minimiza capas en Dockerfiles
- Usa `.dockerignore` (ya implementado)

### Seguridad
- No commitees archivos `.env` a git
- Usa secretos de Docker en producción
- Mantén imágenes actualizadas
- Revisa vulnerabilidades: `docker scan ovp-backend`

---

¿Más problemas? Revisa la documentación completa en [DOCKER_README.md](DOCKER_README.md)

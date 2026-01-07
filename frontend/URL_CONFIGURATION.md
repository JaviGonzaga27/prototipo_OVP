# Configuración de URLs y Variables de Entorno

## 🎯 Problema Resuelto
Las URLs de la API estaban hardcodeadas en el código, lo que causaba problemas con CORS cuando se cambiaba de puerto, dominio o IP. Ahora todas las URLs se configuran dinámicamente desde variables de entorno.

## 📍 Archivos Corregidos

### Frontend
- ✅ `src/config/api.js` - Configuración centralizada de la API
- ✅ `src/services/auth.js` - Servicios de autenticación
- ✅ `src/services/admin.js` - Servicios de administración
- ✅ `src/pages/Settings/index.jsx` - Página de configuración
- ✅ `src/pages/TestResultDetail/index.jsx` - Detalle de resultados

### Variables de Entorno
- ✅ `.env` - Desarrollo local (sin Docker)
- ✅ `.env.development` - Docker en desarrollo
- ✅ `.env.production` - Docker en producción
- ✅ `.env.example` - Plantilla de ejemplo

## 🔧 Cómo Configurar

### 1. Desarrollo Local (sin Docker)
**Archivo:** `.env`
```env
VITE_API_URL=http://localhost:5000/api
```
El backend corre en puerto 5000 por defecto con `npm run dev`.

### 2. Docker Local
**Archivo:** `.env.development` o `.env.production`
```env
VITE_API_URL=http://localhost:3000/api
```
El contenedor backend expone el puerto 3000.

### 3. Producción con Dominio
**Archivo:** `.env.production`
```env
# Con HTTPS
VITE_API_URL=https://api.tudominio.com/api

# O si la API está en el mismo dominio
VITE_API_URL=https://tudominio.com/api
```

### 4. Producción con IP
**Archivo:** `.env.production`
```env
# IP privada (red local)
VITE_API_URL=http://192.168.1.100:3000/api

# IP pública
VITE_API_URL=http://45.67.89.123:3000/api
```

### 5. Puerto Personalizado
**Archivo:** `.env.production`
```env
VITE_API_URL=http://tudominio.com:8080/api
```

## 🐳 Configuración de CORS en Backend

El backend debe permitir solicitudes desde el origen del frontend. En el archivo `.env` del backend:

```env
# Para desarrollo (permitir todo)
CORS_ORIGIN=*

# Para producción (solo tu dominio)
CORS_ORIGIN=https://tudominio.com

# Para múltiples orígenes (separados por coma)
CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com
```

## 📝 Pasos para Cambiar de Entorno

### Cambiar de Local a Docker
1. Editar `.env.development`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
2. Reconstruir contenedor:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Cambiar a Producción con Dominio
1. Editar `.env.production`:
   ```env
   VITE_API_URL=https://api.tudominio.com/api
   ```
2. Configurar CORS en backend `.env`:
   ```env
   CORS_ORIGIN=https://tudominio.com
   ```
3. Reconstruir y desplegar:
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

### Cambiar a IP Pública
1. Editar `.env.production`:
   ```env
   VITE_API_URL=http://TU_IP_PUBLICA:3000/api
   ```
2. Configurar CORS en backend:
   ```env
   CORS_ORIGIN=http://TU_IP_PUBLICA
   ```
3. Asegurar que el puerto 3000 esté abierto en firewall

## ✅ Verificación

### 1. Verificar que las variables se cargan correctamente
En la consola del navegador:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

### 2. Verificar conexión del frontend al backend
```bash
# Ver logs del contenedor frontend
docker-compose logs frontend

# Ver logs del contenedor backend
docker-compose logs backend
```

### 3. Probar endpoints
```bash
# Desde el host
curl http://localhost:3000/health

# Si usas dominio
curl https://api.tudominio.com/health
```

## 🚨 Problemas Comunes

### Error de CORS
**Síntoma:** `Access-Control-Allow-Origin` error en consola
**Solución:** 
- Verificar que `CORS_ORIGIN` en backend coincida con el origen del frontend
- Si usas HTTPS en frontend, backend también debe usar HTTPS o CORS_ORIGIN=*

### Frontend no se conecta al backend
**Síntoma:** Errores de red, timeouts
**Solución:**
1. Verificar que `VITE_API_URL` tenga el formato correcto (con `/api` al final)
2. Verificar que el backend esté corriendo: `docker-compose ps`
3. Verificar logs: `docker-compose logs backend`
4. Probar manualmente: `curl http://localhost:3000/health`

### Cambios en .env no se aplican
**Síntoma:** Los cambios no tienen efecto
**Solución:**
1. Reconstruir contenedores: `docker-compose up --build`
2. Para Vite, las variables deben empezar con `VITE_`
3. Reiniciar el contenedor: `docker-compose restart frontend`

## 🔐 Seguridad en Producción

### ❌ NO hacer en producción:
```env
CORS_ORIGIN=*  # Permite cualquier origen
VITE_API_URL=http://...  # Usar HTTP en producción
```

### ✅ SÍ hacer en producción:
```env
CORS_ORIGIN=https://tudominio.com  # Solo tu dominio
VITE_API_URL=https://api.tudominio.com/api  # HTTPS
```

## 📚 Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

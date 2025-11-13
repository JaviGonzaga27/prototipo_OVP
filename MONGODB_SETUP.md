# Guía de Instalación de MongoDB en Windows

## Opción 1: MongoDB Community Edition (Local)

### Paso 1: Descargar MongoDB

1. Visita: https://www.mongodb.com/try/download/community
2. Selecciona:
   - Version: Latest (7.0 o superior)
   - Platform: Windows
   - Package: MSI

### Paso 2: Instalar MongoDB

1. Ejecuta el instalador MSI descargado
2. Selecciona "Complete" installation
3. En "Service Configuration":
   - Marca "Install MongoDB as a Service"
   - Service Name: MongoDB
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log\`
4. Opcionalmente instala MongoDB Compass (GUI para MongoDB)
5. Completa la instalación

### Paso 3: Verificar Instalación

Abre PowerShell y ejecuta:

```powershell
mongod --version
```

Si ves la versión, MongoDB está instalado correctamente.

### Paso 4: Iniciar MongoDB

Si se instaló como servicio, MongoDB ya está corriendo.

Para verificar:

```powershell
Get-Service MongoDB
```

Si no está corriendo, inícialo:

```powershell
Start-Service MongoDB
```

Para iniciar manualmente (si no está como servicio):

```powershell
# Crear carpeta de datos
New-Item -ItemType Directory -Path "C:\data\db" -Force

# Iniciar MongoDB
mongod --dbpath="C:\data\db"
```

---

## Opción 2: MongoDB Atlas (Cloud - Recomendado para principiantes)

MongoDB Atlas es una base de datos en la nube gratuita (hasta 512MB).

### Paso 1: Crear Cuenta

1. Visita: https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita

### Paso 2: Crear Cluster

1. Selecciona "Build a Database"
2. Elige el plan "FREE" (M0)
3. Selecciona un proveedor cloud (AWS, Google Cloud, o Azure)
4. Elige una región cerca de ti
5. Dale un nombre a tu cluster
6. Click en "Create"

### Paso 3: Configurar Acceso

1. **Username/Password:**
   - Crea un usuario de base de datos
   - Guarda el usuario y contraseña

2. **IP Whitelist:**
   - Click en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - O agrega tu IP específica

### Paso 4: Obtener Connection String

1. Click en "Connect" en tu cluster
2. Selecciona "Connect your application"
3. Copia el connection string, se verá así:
   ```
   mongodb+srv://usuario:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Paso 5: Configurar en el Proyecto

Edita `backend/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:tu_password@cluster.xxxxx.mongodb.net/ovp_database?retryWrites=true&w=majority
```

Reemplaza:
- `usuario` con tu usuario
- `tu_password` con tu contraseña
- `ovp_database` es el nombre de tu base de datos

---

## Verificar Conexión

Después de configurar MongoDB (local o Atlas), verifica que funciona:

1. Inicia el backend:
   ```powershell
   cd backend
   npm run dev
   ```

2. Deberías ver en la consola:
   ```
   ✅ Conectado a MongoDB
   🚀 Servidor corriendo en puerto 5000
   ```

---

## Solución de Problemas

### Error: "connect ECONNREFUSED"

**Causa:** MongoDB no está corriendo

**Solución:**
```powershell
# Si es servicio
Start-Service MongoDB

# Si es manual
mongod --dbpath="C:\data\db"
```

### Error: "Authentication failed"

**Causa:** Usuario/contraseña incorrectos en Atlas

**Solución:** Verifica las credenciales en `.env`

### Error: "IP not whitelisted"

**Causa:** Tu IP no está permitida en Atlas

**Solución:** Agrega 0.0.0.0/0 en Atlas Network Access

---

## Herramientas Recomendadas

### MongoDB Compass (GUI)
- Descarga: https://www.mongodb.com/try/download/compass
- Permite visualizar y gestionar datos fácilmente

### Conexión en Compass:
- Local: `mongodb://localhost:27017`
- Atlas: Usa el connection string de Atlas

---

## Comandos Útiles de MongoDB

```powershell
# Ver servicios de MongoDB
Get-Service MongoDB

# Iniciar servicio
Start-Service MongoDB

# Detener servicio
Stop-Service MongoDB

# Conectarse a MongoDB (CLI)
mongosh

# Listar bases de datos
show dbs

# Usar base de datos
use ovp_database

# Listar colecciones
show collections

# Ver usuarios
db.users.find()
```

---

## Recomendaciones

1. **Para Desarrollo:** Usa MongoDB local (más rápido)
2. **Para Producción/Demo:** Usa MongoDB Atlas (más fácil de compartir)
3. **Backup:** Atlas hace backups automáticos
4. **Seguridad:** Nunca compartas tu connection string con contraseñas

---

## Recursos Adicionales

- [Documentación MongoDB](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Cursos gratis
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)

# ⚠️ CONFIGURACIÓN REQUERIDA

## Error de Autenticación PostgreSQL

El script de inicialización no pudo conectarse a PostgreSQL porque la contraseña en el archivo `.env` no es correcta.

## Pasos para Configurar

### Opción 1: Configurar Contraseña Manualmente

1. Abre el archivo `backend\.env`
2. Encuentra la línea: `DB_PASSWORD=postgres`
3. Cámbiala por tu contraseña real de PostgreSQL
4. Guarda el archivo
5. Ejecuta de nuevo: `npm run init-db`

### Opción 2: Verificar/Cambiar Contraseña de PostgreSQL

Si no recuerdas tu contraseña de PostgreSQL, puedes cambiarla:

#### Usando pgAdmin:
1. Abre pgAdmin
2. Click derecho en "postgres" (servidor)
3. Properties → Connection
4. Verifica el puerto y host

5. Click derecho en "Login/Group Roles" → postgres
6. Properties → Definition
7. Cambia la contraseña

#### Usando psql:
```powershell
# Abre psql como superusuario (puede requerir autenticación de Windows)
psql -U postgres

# Dentro de psql, cambia la contraseña:
ALTER USER postgres PASSWORD 'tu_nueva_contraseña';

# Sal de psql:
\q
```

### Opción 3: Usar Autenticación de Windows (Trust)

Si prefieres no usar contraseña (solo para desarrollo local):

1. Encuentra el archivo `pg_hba.conf` de PostgreSQL (usualmente en `C:\Program Files\PostgreSQL\[version]\data\`)
2. Abre como administrador
3. Encuentra la línea que dice:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
4. Cámbiala a:
   ```
   host    all             all             127.0.0.1/32            trust
   ```
5. Guarda y reinicia el servicio PostgreSQL:
   ```powershell
   Restart-Service postgresql-x64-[version]
   ```
6. En el archivo `.env`, deja `DB_PASSWORD` vacío o como está

### Opción 4: Crear Nueva Base de Datos con Usuario Específico

```sql
-- Conecta a PostgreSQL como superusuario
psql -U postgres

-- Crea un nuevo usuario para la aplicación
CREATE USER ovp_user WITH PASSWORD 'ovp_password123';

-- Crea la base de datos
CREATE DATABASE ovp_database OWNER ovp_user;

-- Otorga todos los privilegios
GRANT ALL PRIVILEGES ON DATABASE ovp_database TO ovp_user;

-- Sal
\q
```

Luego actualiza tu `.env`:
```
DB_USER=ovp_user
DB_PASSWORD=ovp_password123
```

## Configuración Actual Esperada

Tu archivo `.env` debe tener:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ovp_database
DB_USER=postgres
DB_PASSWORD=[TU_CONTRASEÑA_AQUI]
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
NODE_ENV=development
```

## Probar Conexión

Antes de ejecutar `npm run init-db`, puedes probar la conexión:

```powershell
# Esto te pedirá la contraseña
psql -U postgres -d postgres

# Si funciona, verás el prompt de psql:
postgres=#
```

## Una Vez Configurado

Después de configurar correctamente la contraseña:

```powershell
npm run init-db
```

Este comando:
- ✅ Creará las tablas (Users, Questions, TestResults)
- ✅ Insertará usuario admin (admin@ovp.com / admin123)
- ✅ Insertará usuario estudiante (estudiante@test.com / test123)
- ✅ Cargará 10 preguntas del test vocacional

## Si el Problema Persiste

Verifica:
1. ✅ Que el servicio PostgreSQL esté corriendo
2. ✅ Que el puerto 5432 no esté bloqueado
3. ✅ Que el usuario tenga permisos para crear bases de datos
4. ✅ Que no haya espacios extra en el archivo .env

## Necesitas Ayuda?

Ejecuta estos comandos y comparte el resultado:

```powershell
# Ver servicios PostgreSQL
Get-Service -Name postgresql*

# Ver si el puerto está escuchando
Test-NetConnection -ComputerName localhost -Port 5432

# Intentar conexión simple
psql -U postgres -c "SELECT version();"
```

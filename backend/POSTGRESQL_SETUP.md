# Configuración de PostgreSQL para OVP

## Requisitos Previos

- PostgreSQL instalado en tu sistema
- Usuario postgres con contraseña configurada

## Pasos de Configuración

### 1. Crear la Base de Datos

Abre el terminal de PostgreSQL (psql) o pgAdmin y ejecuta:

```sql
CREATE DATABASE ovp_database;
```

O desde PowerShell:

```powershell
# Conectarse a PostgreSQL
psql -U postgres

# Dentro de psql, crear la base de datos
CREATE DATABASE ovp_database;

# Salir
\q
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```powershell
cd backend
Copy-Item .env.example .env
```

Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
# Puerto del servidor
PORT=5000

# Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ovp_database
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui

# JWT Secret (cambia esto por una cadena aleatoria segura)
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRE=30d
```

### 3. Instalar Dependencias

```powershell
npm install
```

### 4. Inicializar la Base de Datos

Este comando creará las tablas y cargará datos iniciales (usuario admin y preguntas del test):

```powershell
npm run init-db
```

Este script:
- ✅ Crea las tablas: Users, TestResults, Questions
- ✅ Inserta un usuario administrador (admin@ovp.com / admin123)
- ✅ Inserta un usuario estudiante de prueba (estudiante@test.com / test123)
- ✅ Carga 10 preguntas del test vocacional
- ✅ Crea un resultado de test de ejemplo

### 5. Iniciar el Servidor

```powershell
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

## Estructura de la Base de Datos

### Tabla: Users
| Campo     | Tipo         | Descripción                    |
|-----------|--------------|--------------------------------|
| id        | INTEGER      | PK, auto-increment             |
| name      | STRING(100)  | Nombre del usuario             |
| email     | STRING(100)  | Email único                    |
| password  | STRING       | Contraseña hasheada (bcrypt)   |
| role      | ENUM         | 'student' o 'admin'            |
| createdAt | TIMESTAMP    | Fecha de creación              |
| updatedAt | TIMESTAMP    | Fecha de actualización         |

### Tabla: Questions
| Campo     | Tipo         | Descripción                    |
|-----------|--------------|--------------------------------|
| id        | INTEGER      | PK, auto-increment             |
| text      | TEXT         | Texto de la pregunta           |
| options   | JSONB        | Array de opciones              |
| category  | STRING(50)   | Categoría (ej: ciencias)       |
| order     | INTEGER      | Orden de aparición             |
| isActive  | BOOLEAN      | Si está activa o no            |
| createdAt | TIMESTAMP    | Fecha de creación              |
| updatedAt | TIMESTAMP    | Fecha de actualización         |

### Tabla: TestResults
| Campo       | Tipo         | Descripción                    |
|-------------|--------------|--------------------------------|
| id          | INTEGER      | PK, auto-increment             |
| userId      | INTEGER      | FK a Users                     |
| answers     | JSONB        | Respuestas del test            |
| results     | JSONB        | Resultados calculados          |
| completedAt | TIMESTAMP    | Fecha de finalización          |
| createdAt   | TIMESTAMP    | Fecha de creación              |
| updatedAt   | TIMESTAMP    | Fecha de actualización         |

## Usuarios por Defecto

Después de ejecutar `npm run init-db`:

### Administrador
- **Email**: admin@ovp.com
- **Password**: admin123
- **Rol**: admin

### Estudiante de Prueba
- **Email**: estudiante@test.com
- **Password**: test123
- **Rol**: student

## Comandos Útiles de PostgreSQL

### Conectarse a la base de datos
```powershell
psql -U postgres -d ovp_database
```

### Ver todas las tablas
```sql
\dt
```

### Ver estructura de una tabla
```sql
\d users
\d questions
\d testresults
```

### Ver datos de las tablas
```sql
SELECT * FROM "Users";
SELECT * FROM "Questions";
SELECT * FROM "TestResults";
```

### Limpiar y reinicializar
Si necesitas limpiar la base de datos y empezar de nuevo:

```sql
-- Eliminar todas las tablas
DROP TABLE IF EXISTS "TestResults" CASCADE;
DROP TABLE IF EXISTS "Questions" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
```

Luego ejecuta de nuevo:
```powershell
npm run init-db
```

## API Endpoints Disponibles

### Preguntas (Questions)
- `GET /api/questions` - Obtener preguntas activas (requiere auth)
- `GET /api/questions/all` - Obtener todas las preguntas (admin)
- `GET /api/questions/:id` - Obtener pregunta por ID (admin)
- `POST /api/questions` - Crear pregunta (admin)
- `PUT /api/questions/:id` - Actualizar pregunta (admin)
- `DELETE /api/questions/:id` - Eliminar pregunta (admin)
- `PATCH /api/questions/:id/toggle` - Activar/desactivar pregunta (admin)

### Autenticación (Auth)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Administración (Admin)
- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/users/:id` - Obtener usuario
- `PUT /api/admin/users/:id` - Actualizar usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario
- `GET /api/admin/results` - Ver todos los resultados
- `GET /api/admin/results/:userId` - Resultados de un usuario
- `GET /api/admin/stats` - Estadísticas generales

### Tests
- `POST /api/test/results` - Guardar resultado
- `GET /api/test/my-results` - Mis resultados
- `GET /api/test/results/:id` - Obtener resultado específico

## Solución de Problemas

### Error: "database does not exist"
Ejecuta:
```sql
CREATE DATABASE ovp_database;
```

### Error: "password authentication failed"
Verifica que tu contraseña en el archivo `.env` sea correcta.

### Error: "relation does not exist"
Ejecuta `npm run init-db` para crear las tablas.

### Las preguntas no aparecen en el frontend
Las preguntas ahora se cargan desde la base de datos. Asegúrate de:
1. Haber ejecutado `npm run init-db`
2. Que el backend esté corriendo
3. Que el frontend esté conectado al backend correcto

## Migración desde MongoDB

Si vienes de una versión anterior con MongoDB:

1. Las contraseñas siguen siendo las mismas (bcrypt)
2. Los modelos ahora usan Sequelize en lugar de Mongoose
3. Los IDs son enteros en lugar de ObjectId de MongoDB
4. Las relaciones se manejan con Foreign Keys
5. Los datos complejos (arrays, objetos) usan JSONB

## Notas Importantes

- **Seguridad**: Cambia las contraseñas por defecto en producción
- **JWT_SECRET**: Usa una cadena aleatoria segura en producción
- **Backups**: Realiza backups regulares de la base de datos
- **Sincronización**: El servidor NO ejecuta `sync({ force: true })` automáticamente para evitar pérdida de datos

## Más Información

Para más detalles sobre Sequelize: https://sequelize.org/docs/v6/
Para más detalles sobre PostgreSQL: https://www.postgresql.org/docs/

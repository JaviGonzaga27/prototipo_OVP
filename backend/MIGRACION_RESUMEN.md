# 🎯 Migración Completada: MongoDB → PostgreSQL

## ✅ Cambios Realizados

### 1. Dependencias Actualizadas

**Eliminado:**
- mongoose (MongoDB ORM)

**Agregado:**
- pg (^8.16.3) - Driver de PostgreSQL
- pg-hstore (^2.3.4) - Serialización de objetos para PostgreSQL
- sequelize (^6.37.7) - ORM para PostgreSQL

### 2. Configuración de Base de Datos

**Archivo Nuevo:** `backend/config/database.js`
- Configuración de Sequelize
- Pool de conexiones
- Logging para desarrollo

**Variables de Entorno Actualizadas** (`.env`)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ovp_database
DB_USER=postgres
DB_PASSWORD=[CONFIGURAR]
```

### 3. Modelos Migrados

#### `backend/models/User.js`
**Cambios:**
- Mongoose Schema → Sequelize Model
- `_id` → `id` (INTEGER autoincrement)
- Hooks beforeCreate/beforeUpdate para hashear contraseña con bcrypt
- ENUM para role (student, admin)
- Timestamps automáticos

#### `backend/models/TestResult.js`
**Cambios:**
- Mongoose Schema → Sequelize Model
- Campo `answers` ahora es JSONB (array de objetos)
- Campo `results` ahora es JSONB (objeto con topCareers)
- Relación belongsTo con User (userId como FK)
- Campo `completedAt` con default CURRENT_TIMESTAMP

#### `backend/models/Question.js` ⭐ NUEVO
**Características:**
- Almacena preguntas del test en la BD (antes estaban hardcoded en frontend)
- Campo `text`: TEXT (pregunta)
- Campo `options`: JSONB array (opciones de respuesta)
- Campo `category`: STRING (categoría: ciencias, ingeniería, etc.)
- Campo `order`: INTEGER (orden de aparición)
- Campo `isActive`: BOOLEAN (para activar/desactivar)

#### `backend/models/index.js` ⭐ NUEVO
- Exporta todos los modelos
- Función `syncModels()` para sincronizar con BD

### 4. Controladores Actualizados

#### `backend/controllers/authController.js`
**Cambios:**
- `User.findOne()` → `User.findOne({ where: {...} })`
- `User.create()` → mantiene sintaxis similar
- `User.findById()` → `User.findByPk()`
- `user._id` → `user.id`
- Sintaxis Sequelize para queries

#### `backend/controllers/adminController.js`
**Cambios:**
- `User.find()` → `User.findAll({ where, include, order })`
- `.select('-password')` → `{ attributes: { exclude: ['password'] } }`
- `.populate()` → `{ include: [{ model: User, attributes: [...] }] }`
- `.sort()` → `{ order: [['field', 'ASC/DESC']] }`
- `user.deleteOne()` → `user.destroy()`
- `User.countDocuments()` → `User.count({ where })`
- `result.userId.toString()` → `result.userId` (ya es número)

#### `backend/controllers/testController.js`
**Cambios:**
- `TestResult.find()` → `TestResult.findAll({ where, order })`
- `TestResult.findById()` → `TestResult.findByPk()`
- `result.userId.toString()` → `result.userId` (comparación directa de enteros)

#### `backend/controllers/questionController.js` ⭐ NUEVO
**Endpoints:**
- `getActiveQuestions()` - GET /api/questions
- `getAllQuestions()` - GET /api/questions/all (admin)
- `getQuestionById()` - GET /api/questions/:id (admin)
- `createQuestion()` - POST /api/questions (admin)
- `updateQuestion()` - PUT /api/questions/:id (admin)
- `deleteQuestion()` - DELETE /api/questions/:id (admin)
- `toggleQuestionStatus()` - PATCH /api/questions/:id/toggle (admin)

### 5. Middleware Actualizado

#### `backend/middleware/auth.js`
**Cambios:**
- `User.findById().select()` → `User.findByPk(id, { attributes: { exclude: ['password'] } })`
- Import desde `models/index.js`

### 6. Rutas Nuevas

#### `backend/routes/questionRoutes.js` ⭐ NUEVO
- Rutas para gestión de preguntas
- Protección con middleware `protect` y `adminOnly`

### 7. Server.js Actualizado

**Cambios:**
- `mongoose.connect()` → `sequelize.authenticate()`
- `mongoose.connection` → `sequelize.sync()`
- Import de `questionRoutes`
- Uso de `/api/questions`

### 8. Scripts Nuevos

#### `backend/scripts/initDatabase.js` ⭐ NUEVO
**Funcionalidad:**
- Conecta a PostgreSQL
- Ejecuta `sequelize.sync({ force: true })` para crear tablas
- Crea usuario admin: `admin@ovp.com / admin123`
- Crea usuario estudiante: `estudiante@test.com / test123`
- Carga 10 preguntas del test vocacional
- Crea resultado de test de ejemplo

**Ejecutar:** `npm run init-db`

#### `backend/createDatabase.ps1` ⭐ NUEVO
Script PowerShell para:
- Verificar conexión a PostgreSQL
- Crear base de datos `ovp_database`
- Configurar archivo `.env` automáticamente
- Guía interactiva para el usuario

### 9. Documentación Nueva

#### `backend/POSTGRESQL_SETUP.md`
- Guía completa de instalación
- Estructura de tablas
- Usuarios por defecto
- Comandos útiles de PostgreSQL
- API endpoints disponibles
- Solución de problemas

#### `backend/CONFIGURACION_REQUERIDA.md`
- Guía para resolver errores de autenticación
- Opciones para configurar contraseña
- Pasos de verificación
- Comandos de diagnóstico

## 🔧 Comandos npm Actualizados

```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js",
  "init-db": "node scripts/initDatabase.js"  ⭐ NUEVO
}
```

## 📊 Comparación: Antes vs Después

| Aspecto | Antes (MongoDB) | Después (PostgreSQL) |
|---------|----------------|----------------------|
| ORM | Mongoose | Sequelize |
| IDs | ObjectId (string) | INTEGER autoincrement |
| Queries | `find()`, `findById()` | `findAll()`, `findByPk()` |
| Relaciones | `populate()` | `include` |
| Arrays | Array nativo | JSONB |
| Filtros | `{ field: value }` | `{ where: { field: value } }` |
| Ordenamiento | `.sort({ field: 1 })` | `{ order: [['field', 'ASC']] }` |
| Exclusión | `.select('-field')` | `{ attributes: { exclude: ['field'] } }` |
| Conteo | `.countDocuments()` | `.count()` |
| Eliminación | `.deleteOne()` | `.destroy()` |
| Preguntas | Hardcoded en frontend | En base de datos |

## 🚀 Próximos Pasos

### 1. Configurar PostgreSQL (PENDIENTE ⚠️)

```powershell
cd backend

# Opción A: Usar script PowerShell
.\createDatabase.ps1

# Opción B: Manual
# - Edita .env con tu contraseña de PostgreSQL
# - Ejecuta: npm run init-db
```

### 2. Verificar Conexión

```powershell
# Debe mostrar: ✅ Conectado a PostgreSQL
npm run dev
```

### 3. Actualizar Frontend (Opcional)

El frontend puede seguir funcionando con las preguntas hardcoded, pero para usar las de la BD:

**Modificar:** `src/pages/Questionnaire/index.jsx`
```javascript
// Cambiar de usar constants/questions
import { questions } from '../../constants/questions';

// A usar API
useEffect(() => {
  const fetchQuestions = async () => {
    const response = await fetch('http://localhost:5000/api/questions', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setQuestions(data.questions);
  };
  fetchQuestions();
}, []);
```

### 4. Probar API con Postman/Thunder Client

**Login:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@ovp.com",
  "password": "admin123"
}
```

**Obtener Preguntas:**
```http
GET http://localhost:5000/api/questions
Authorization: Bearer [TOKEN]
```

**Crear Pregunta (Admin):**
```http
POST http://localhost:5000/api/questions
Authorization: Bearer [ADMIN_TOKEN]
Content-Type: application/json

{
  "text": "¿Te interesa trabajar con animales?",
  "options": ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"],
  "category": "veterinaria",
  "order": 11,
  "isActive": true
}
```

## 📝 Resumen de Archivos Modificados

### Modificados ✏️
- `backend/package.json` - Dependencias y scripts
- `backend/.env` - Variables de PostgreSQL
- `backend/.env.example` - Template actualizado
- `backend/server.js` - Sequelize en lugar de Mongoose
- `backend/models/User.js` - Modelo Sequelize
- `backend/models/TestResult.js` - Modelo Sequelize
- `backend/controllers/authController.js` - Sintaxis Sequelize
- `backend/controllers/adminController.js` - Sintaxis Sequelize
- `backend/controllers/testController.js` - Sintaxis Sequelize
- `backend/middleware/auth.js` - Sequelize findByPk

### Nuevos ⭐
- `backend/config/database.js` - Configuración Sequelize
- `backend/models/Question.js` - Modelo de preguntas
- `backend/models/index.js` - Exportador de modelos
- `backend/controllers/questionController.js` - CRUD de preguntas
- `backend/routes/questionRoutes.js` - Rutas de preguntas
- `backend/scripts/initDatabase.js` - Inicialización de BD
- `backend/createDatabase.ps1` - Script PowerShell
- `backend/POSTGRESQL_SETUP.md` - Documentación
- `backend/CONFIGURACION_REQUERIDA.md` - Guía de configuración
- `backend/MIGRACION_RESUMEN.md` - Este archivo

### Sin Cambios ✅
- Frontend completo (React, Vite, Tailwind)
- Rutas existentes (auth, admin, test)
- Estructura de carpetas
- Lógica de autenticación JWT
- Middleware de autorización

## 🎯 Estado Actual

✅ **Completado:**
- Migración de todos los modelos a Sequelize
- Actualización de todos los controladores
- Creación de modelo Question para BD
- Script de inicialización de base de datos
- Documentación completa
- Routes y API endpoints

⚠️ **Pendiente:**
- Configurar contraseña correcta en `.env`
- Ejecutar `npm run init-db`
- Probar conexión a PostgreSQL
- (Opcional) Actualizar frontend para usar preguntas de BD

## 💡 Ventajas de PostgreSQL

1. **Tipado fuerte**: INTEGER, TEXT, JSONB, ENUM
2. **JSONB**: Queries rápidas en datos JSON
3. **Relaciones con FK**: Integridad referencial
4. **Transacciones**: ACID compliant
5. **Escalabilidad**: Mejor para producción
6. **Índices**: Búsquedas más rápidas
7. **Preguntas dinámicas**: Gestión desde panel admin

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Variables de entorno para credenciales
- ✅ Middleware de autorización por rol
- ⚠️ Cambiar JWT_SECRET en producción
- ⚠️ Cambiar contraseñas por defecto en producción

## 📚 Recursos

- Sequelize: https://sequelize.org/docs/v6/
- PostgreSQL: https://www.postgresql.org/docs/
- pg (node-postgres): https://node-postgres.com/
- JSONB en PostgreSQL: https://www.postgresql.org/docs/current/datatype-json.html

---

**Migración completada el:** [Fecha actual]
**Versiones:**
- Node.js: v22.6.0
- PostgreSQL: (por configurar)
- Sequelize: 6.37.7
- Express: 4.18.2

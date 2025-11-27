# 📬 Colección Postman - API OVP

## 🚀 Guía de Uso

### 1️⃣ Importar la Colección

1. Abre Postman
2. Click en **Import** (esquina superior izquierda)
3. Selecciona el archivo: `OVP_API_Collection.postman_collection.json`
4. La colección se importará automáticamente

### 2️⃣ Configurar Variables de Entorno

La colección incluye variables predefinidas:

- **baseUrl**: `http://localhost:5000/api` (puede modificarse si tu servidor está en otro puerto)
- **authToken**: Se establece automáticamente al hacer login

### 3️⃣ Flujo de Pruebas Recomendado

#### **PASO 1: Autenticación**

1. **Registrar Usuario**
   - Carpeta: `Auth - Autenticación`
   - Endpoint: `Registro de Usuario`
   - Guarda automáticamente el token

2. **Login de Usuario** (si ya tienes cuenta)
   - Endpoint: `Login de Usuario`
   - Guarda automáticamente el token

3. **Login de Admin** (para endpoints administrativos)
   - Endpoint: `Login de Admin`
   - Credenciales por defecto:
     - Email: `admin@ovp.com`
     - Password: `Admin123!`

#### **PASO 2: Probar Cuestionario**

1. **Obtener Preguntas Activas**
   - Carpeta: `Questions - Cuestionario`
   - Endpoint: `Obtener Preguntas Activas`
   - Verifica que tengas las 65 preguntas

2. **Obtener Preguntas Agrupadas**
   - Muestra las preguntas organizadas por categoría

#### **PASO 3: Realizar Test**

1. **Realizar Predicción ML**
   - Carpeta: `Test - Predicciones y Resultados`
   - Endpoint: `Realizar Predicción ML`
   - Ya incluye un ejemplo con las 65 respuestas
   - Valores: 1 a 5

2. **Obtener Mis Resultados**
   - Verifica los tests que has realizado

3. **Obtener Resultado por ID**
   - Consulta un resultado específico

#### **PASO 4: Administración (requiere login de admin)**

1. **Estadísticas del Sistema**
   - Carpeta: `Admin - Administración`
   - Endpoint: `Obtener Estadísticas`

2. **Gestionar Usuarios**
   - Listar todos los usuarios
   - Ver, actualizar o eliminar usuarios específicos

3. **Gestionar Preguntas**
   - Carpeta: `Questions - Cuestionario`
   - Endpoints con prefijo `[ADMIN]`
   - Crear, actualizar, eliminar preguntas

## 📋 Estructura de la Colección

```
📂 OVP API - Sistema de Orientación Vocacional
│
├── 📁 Auth - Autenticación (6 endpoints)
│   ├── Registro de Usuario
│   ├── Login de Usuario
│   ├── Login de Admin
│   ├── Obtener Mi Perfil
│   ├── Cambiar Contraseña
│   └── Actualizar Perfil
│
├── 📁 Test - Predicciones y Resultados (4 endpoints)
│   ├── Realizar Predicción ML ⭐ (Principal)
│   ├── Guardar Resultados (Legacy)
│   ├── Obtener Mis Resultados
│   └── Obtener Resultado por ID
│
├── 📁 Questions - Cuestionario (8 endpoints)
│   ├── Obtener Preguntas Activas
│   ├── Obtener Preguntas Agrupadas
│   ├── [ADMIN] Obtener Todas las Preguntas
│   ├── [ADMIN] Obtener Pregunta por ID
│   ├── [ADMIN] Crear Pregunta
│   ├── [ADMIN] Actualizar Pregunta
│   ├── [ADMIN] Eliminar Pregunta
│   └── [ADMIN] Activar/Desactivar Pregunta
│
└── 📁 Admin - Administración (7 endpoints)
    ├── Obtener Estadísticas
    ├── Listar Todos los Usuarios
    ├── Obtener Usuario por ID
    ├── Actualizar Usuario
    ├── Eliminar Usuario
    ├── Obtener Todos los Resultados
    └── Obtener Resultados de Usuario
```

## 🔑 Autenticación Automática

Los endpoints de **Login** y **Registro** incluyen scripts que:
- Extraen automáticamente el token de la respuesta
- Guardan el token en la variable `{{authToken}}`
- No necesitas copiar y pegar el token manualmente

## 📝 Notas Importantes

### Respuestas del Test
El endpoint de predicción requiere **65 respuestas** (q1 a q65) con valores de 1 a 5:

- **q1-q30**: RIASEC (6 dimensiones × 5 preguntas)
- **q31-q62**: Gardner (8 inteligencias × 4 preguntas)
- **q63-q65**: Rendimiento académico

### Códigos de Respuesta

- **200**: Éxito (GET, PUT)
- **201**: Recurso creado (POST)
- **400**: Error de validación
- **401**: No autenticado
- **403**: Sin permisos (requiere admin)
- **404**: No encontrado
- **500**: Error del servidor

## 🔧 Troubleshooting

### El token no se guarda automáticamente
- Verifica que estés usando un **Environment** en Postman
- Crea uno nuevo: Click en "Environments" → "Create Environment"
- Nombra el environment y guárdalo

### Error 401 - Unauthorized
- Ejecuta primero el endpoint de Login
- Verifica que la variable `{{authToken}}` tenga un valor

### Error 403 - Forbidden
- El endpoint requiere permisos de admin
- Usa el endpoint `Login de Admin` primero

### Error de conexión
- Verifica que el servidor backend esté corriendo en `http://localhost:5000`
- Ajusta la variable `baseUrl` si usas otro puerto

## 📚 Ejemplos de Uso

### Crear un nuevo usuario y realizar test completo

```
1. POST /auth/register → Token guardado automáticamente
2. GET /questions → Obtener las 65 preguntas
3. POST /test/predict → Enviar respuestas y obtener predicción
4. GET /test/my-results → Ver historial de tests
```

### Administración del sistema

```
1. POST /auth/login (admin@ovp.com) → Token de admin
2. GET /admin/stats → Ver estadísticas
3. GET /admin/users → Listar usuarios
4. GET /questions/all → Ver todas las preguntas
5. POST /questions → Crear nueva pregunta
```

## 🎯 Endpoints Destacados

- ⭐ **POST /test/predict**: El más importante, realiza la predicción con ML
- 📊 **GET /admin/stats**: Dashboard de estadísticas
- 📝 **GET /questions/grouped**: Preguntas organizadas por categoría
- 👤 **GET /auth/me**: Información del usuario actual

---

**¿Necesitas ayuda?** Cada endpoint incluye una descripción detallada en Postman.

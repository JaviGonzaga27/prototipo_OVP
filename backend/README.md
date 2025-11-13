# Backend - Sistema de Orientación Vocacional

Backend API REST para el sistema de orientación vocacional profesional (OVP).

## Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (instalado localmente o conexión a MongoDB Atlas)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
   - Copia `.env.example` a `.env`
   - Modifica las variables según tu configuración

3. Crear usuario administrador inicial:
```bash
node createAdmin.js
```

Credenciales por defecto:
- Email: `admin@ovp.com`
- Contraseña: `admin123`

⚠️ **Importante:** Cambia estas credenciales después del primer login.

## Ejecutar el Servidor

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## API Endpoints

### Autenticación (`/api/auth`)
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `GET /me` - Obtener usuario actual (requiere token)

### Test (`/api/test`)
- `POST /results` - Guardar resultados del test
- `GET /my-results` - Obtener mis resultados
- `GET /results/:id` - Obtener resultado específico

### Administración (`/api/admin`)
- `GET /users` - Listar todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `GET /results` - Obtener todos los resultados
- `GET /results/:userId` - Obtener resultados de un usuario
- `GET /stats` - Obtener estadísticas generales

## Estructura del Proyecto

```
backend/
├── controllers/       # Lógica de negocio
├── middleware/        # Middleware de autenticación
├── models/           # Modelos de MongoDB
├── routes/           # Definición de rutas
├── .env              # Variables de entorno
├── server.js         # Archivo principal
└── createAdmin.js    # Script para crear admin
```

## Roles de Usuario

- **student**: Usuario estándar que puede realizar tests
- **admin**: Administrador con acceso completo al sistema

## Seguridad

- Las contraseñas se encriptan con bcrypt
- Autenticación mediante JWT
- Tokens válidos por 30 días
- Middleware de protección de rutas

## Base de Datos

### Colecciones:
- **users**: Información de usuarios
- **testresults**: Resultados de tests vocacionales

# Sistema de Orientación Vocacional Profesional (OVP)

Sistema completo de orientación vocacional con frontend React + backend Node.js/Express/MongoDB.

## 📋 Características

- ✅ Sistema de autenticación (Login/Registro)
- ✅ Roles de usuario (Estudiante/Administrador)
- ✅ Cuestionario vocacional interactivo
- ✅ Cálculo y visualización de resultados
- ✅ Guardado de resultados en base de datos
- ✅ Panel de administración
- ✅ Gestión de usuarios
- ✅ Visualización de resultados de tests

## 🛠️ Tecnologías

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Heroicons
- Vite

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Bcrypt

## 📦 Instalación

### Requisitos Previos

1. **Node.js** (v18 o superior)
2. **MongoDB** (instalado localmente o conexión a MongoDB Atlas)
3. **npm** o **yarn**

### Paso 1: Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd prototipo_OVP
```

### Paso 2: Configurar el Backend

```bash
cd backend
npm install
```

Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ovp_database
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
```

Crear usuario administrador:
```bash
node createAdmin.js
```

Iniciar el servidor backend:
```bash
npm run dev
```

El backend estará corriendo en `http://localhost:5000`

### Paso 3: Configurar el Frontend

En una nueva terminal:

```bash
# Desde la raíz del proyecto
npm install
```

Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

El archivo `.env` debe contener:
```
VITE_API_URL=http://localhost:5000/api
```

Iniciar el frontend:
```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## 👤 Credenciales por Defecto

### Administrador
- Email: `admin@ovp.com`
- Contraseña: `admin123`

⚠️ **Importante:** Cambia estas credenciales después del primer login.

## 🚀 Uso

1. **Registro**: Los usuarios pueden registrarse con nombre, email y contraseña
2. **Login**: Iniciar sesión con credenciales
3. **Test Vocacional**: Responder el cuestionario de orientación
4. **Resultados**: Ver las carreras recomendadas basadas en las respuestas
5. **Perfil**: Consultar información personal y resultados anteriores
6. **Panel Admin**: Los administradores pueden:
   - Ver y gestionar usuarios
   - Consultar todos los resultados de tests
   - Ver estadísticas generales

## 📁 Estructura del Proyecto

```
prototipo_OVP/
├── backend/
│   ├── controllers/       # Lógica de negocio
│   ├── middleware/        # Autenticación
│   ├── models/           # Modelos MongoDB
│   ├── routes/           # Rutas API
│   ├── server.js         # Servidor principal
│   └── createAdmin.js    # Script crear admin
├── src/
│   ├── components/       # Componentes React
│   ├── context/          # Context API
│   ├── pages/           # Páginas
│   ├── services/        # Servicios API
│   └── App.jsx          # Componente principal
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Tests
- `POST /api/test/results` - Guardar resultados
- `GET /api/test/my-results` - Obtener mis resultados
- `GET /api/test/results/:id` - Obtener resultado específico

### Administración (Solo Admin)
- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/users/:id` - Obtener usuario
- `PUT /api/admin/users/:id` - Actualizar usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario
- `GET /api/admin/results` - Todos los resultados
- `GET /api/admin/results/:userId` - Resultados de usuario
- `GET /api/admin/stats` - Estadísticas

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Tokens válidos por 30 días
- Middleware de protección de rutas
- Validación de roles

## 🐛 Solución de Problemas

### MongoDB no conecta
- Verifica que MongoDB esté corriendo: `mongod --version`
- Verifica la URI en `.env`
- Para MongoDB Atlas, verifica las credenciales y whitelist IP

### Error de CORS
- Verifica que el backend esté corriendo en el puerto correcto
- Verifica que VITE_API_URL en frontend apunte al backend correcto

### Token inválido
- Limpia localStorage del navegador
- Vuelve a iniciar sesión

## 📝 Notas de Desarrollo

- El frontend usa Vite para desarrollo rápido
- El backend usa `--watch` para auto-reload
- Los resultados se guardan automáticamente al completar el test
- El panel de admin solo es accesible para usuarios con rol 'admin'

## 📄 Licencia

Este proyecto es parte de un prototipo educativo.

## 👥 Autores

Javier Gonzaga - Francisco Terán

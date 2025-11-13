# Sistema de Orientación Vocacional Profesional (OVP)

Sistema completo de orientación vocacional con autenticación, gestión de usuarios y panel de administración.

## 🚀 Inicio Rápido

### Requisitos
- Node.js v18+
- MongoDB (local o Atlas)
- npm

### Instalación Rápida

1. **Instalar dependencias:**
```bash
# Backend
cd backend
npm install

# Frontend (desde la raíz)
cd ..
npm install
```

2. **Configurar MongoDB:**
   - Asegúrate de que MongoDB esté corriendo
   - En Windows: `mongod --dbpath=C:\data\db`

3. **Crear usuario administrador:**
```bash
# En PowerShell
.\create-admin.ps1
```

4. **Iniciar ambos servidores:**
```bash
# En PowerShell
.\start.ps1
```

O manualmente:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🔐 Credenciales por Defecto

**Administrador:**
- Email: `admin@ovp.com`
- Contraseña: `admin123`

## 📚 Documentación Completa

Ver [SETUP.md](SETUP.md) para instrucciones detalladas.

## ✨ Características

- ✅ Autenticación JWT
- ✅ Registro de usuarios
- ✅ Roles (Estudiante/Admin)
- ✅ Cuestionario vocacional
- ✅ Resultados guardados en BD
- ✅ Panel de administración
- ✅ Gestión de usuarios
- ✅ Visualización de estadísticas

## 🛠️ Tecnologías

**Frontend:** React, Tailwind CSS, React Router
**Backend:** Node.js, Express, MongoDB, JWT

## 📝 Scripts Disponibles

- `start.ps1` - Inicia frontend y backend
- `start-backend.ps1` - Solo backend
- `create-admin.ps1` - Crea usuario admin

## 🌐 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## 👥 Autores

Javier Gonzaga - Francisco Terán
# prototipo_OVP

# Arquitectura Docker - Sistema OVP

```
┌─────────────────────────────────────────────────────────────────┐
│                         DOCKER COMPOSE                          │
│                         (ovp-network)                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   FRONTEND       │    │   BACKEND        │    │   DATABASE       │
│  (Nginx + React) │◄───│ (Node.js + Python)   │   (PostgreSQL)   │
│                  │    │                  │◄───│                  │
│  Puerto: 80      │    │  Puerto: 3000    │    │  Puerto: 5432    │
│                  │    │                  │    │                  │
│  ┌────────────┐  │    │  ┌────────────┐  │    │  ┌────────────┐  │
│  │  Nginx     │  │    │  │  Express   │  │    │  │ PostgreSQL │  │
│  │  (Prod)    │  │    │  │   API      │  │    │  │    16      │  │
│  └────────────┘  │    │  └────────────┘  │    │  └────────────┘  │
│  ┌────────────┐  │    │  ┌────────────┐  │    │                  │
│  │  React     │  │    │  │  Sequelize │  │    │  Volume:         │
│  │   Build    │  │    │  │   ORM      │  │    │  postgres_data   │
│  └────────────┘  │    │  └────────────┘  │    │                  │
│                  │    │  ┌────────────┐  │    └──────────────────┘
│  Multi-stage     │    │  │  Python 3  │  │
│  Build           │    │  │  ML Engine │  │
│                  │    │  └────────────┘  │
└──────────────────┘    │  ┌────────────┐  │
                        │  │ scikit-    │  │
                        │  │  learn     │  │
                        │  └────────────┘  │
                        │                  │
                        │  Volume:         │
                        │  ml_models       │
                        └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      FLUJO DE DATOS                             │
└─────────────────────────────────────────────────────────────────┘

Usuario  →  Frontend (HTTP/80)  →  Backend (HTTP/3000)  →  Database
                  │                       │
                  │                       ▼
                  │              Python ML Service
                  │              (Integrado en Backend)
                  │                       │
                  ◄───────────────────────┘
                   JSON Response


┌─────────────────────────────────────────────────────────────────┐
│                   PROCESO DE BUILD                              │
└─────────────────────────────────────────────────────────────────┘

FRONTEND:
  Stage 1 (Builder):
    └─ Node 20 Alpine
       └─ npm ci
          └─ npm run build (Vite)
             └─ dist/
  
  Stage 2 (Production):
    └─ Nginx Alpine
       └─ Copia dist/ desde Stage 1
          └─ Configura nginx.conf
             └─ Sirve archivos estáticos

BACKEND:
  └─ Node 20 Alpine
     ├─ Instala Python 3
     ├─ npm ci --only=production
     ├─ pip install -r ml/requirements.txt
     ├─ Copia código fuente
     └─ Ejecuta server.js
        └─ ML invocado bajo demanda

DATABASE:
  └─ PostgreSQL 16 Alpine (imagen oficial)
     ├─ Inicialización automática
     ├─ Encoding UTF-8
     └─ Persistencia en volume


┌─────────────────────────────────────────────────────────────────┐
│                  VARIABLES DE ENTORNO                           │
└─────────────────────────────────────────────────────────────────┘

Frontend:
  - VITE_API_URL: URL del backend API

Backend:
  - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
  - JWT_SECRET, JWT_EXPIRES_IN
  - NODE_ENV
  - INIT_DB (true/false para init automático)

Database:
  - POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD


┌─────────────────────────────────────────────────────────────────┐
│                    VOLÚMENES PERSISTENTES                       │
└─────────────────────────────────────────────────────────────────┘

postgres_data:
  └─ /var/lib/postgresql/data
     └─ Datos de la base de datos
     └─ Persiste entre reinicios

ml_models:
  └─ /app/ml/models
     └─ Modelos ML entrenados
     └─ Compartido entre backend y ML


┌─────────────────────────────────────────────────────────────────┐
│                    HEALTH CHECKS                                │
└─────────────────────────────────────────────────────────────────┘

Backend:
  - Endpoint: GET /health
  - Intervalo: 30s
  - Timeout: 3s
  - Retries: 3

Database:
  - Comando: pg_isready
  - Intervalo: 10s
  - Timeout: 5s
  - Retries: 5


┌─────────────────────────────────────────────────────────────────┐
│                 DEPENDENCIAS DE INICIO                          │
└─────────────────────────────────────────────────────────────────┘

Database
    ↓ (healthcheck wait)
Backend
    ↓ (wait)
Frontend


┌─────────────────────────────────────────────────────────────────┐
│                SEGURIDAD Y MEJORES PRÁCTICAS                    │
└─────────────────────────────────────────────────────────────────┘

✅ Multi-stage builds para frontend (reduce tamaño)
✅ Alpine Linux (imágenes más pequeñas)
✅ Health checks en todos los servicios
✅ Volumes para persistencia de datos
✅ Network aislada (ovp-network)
✅ .dockerignore para optimizar builds
✅ Variables de entorno para configuración
✅ Restart policy: unless-stopped
✅ Proceso de init-db automatizado
✅ ML integrado en backend (no servicio separado)

⚠️  CAMBIAR en producción:
   - DB_PASSWORD
   - JWT_SECRET
   - Configurar HTTPS en Nginx
   - No exponer puerto 5432 públicamente

# Arquitectura del Sistema OVP (Orientación Vocacional Profesional)

## Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Frontend - React + Vite"
        UI[/"🖥️ Interfaz de Usuario<br/>(React 18)"/]
        Router["React Router v6<br/>Navegación"]
        Auth["AuthContext<br/>Autenticación JWT"]
        Pages["Páginas<br/>- Home<br/>- Login<br/>- Questionnaire<br/>- Results<br/>- Profile<br/>- TestHistory<br/>- Admin<br/>- Settings"]
        Components["Componentes<br/>- Navbar<br/>- ProtectedRoute<br/>- QuestionCard<br/>- CareerCard"]
        Services["Servicios API<br/>- auth.js<br/>- admin.js"]
    end

    subgraph "Backend - Node.js + Express"
        API["🚀 API REST<br/>Express Server<br/>Puerto 5000"]
        Routes["Rutas<br/>- /api/auth<br/>- /api/admin<br/>- /api/test<br/>- /api/questions"]
        Controllers["Controladores<br/>- authController<br/>- adminController<br/>- testController<br/>- questionController"]
        Middleware["Middleware<br/>- protect (JWT)<br/>- role check"]
        Models["Modelos Sequelize<br/>- User<br/>- Question<br/>- TestResult"]
    end

    subgraph "Machine Learning - Python"
        MLScript["🤖 predict.py<br/>Script de Predicción"]
        MLModel["Random Forest<br/>modelo_random_forest.pkl"]
        Encoder["Label Encoder<br/>label_encoder.pkl"]
        Processing["Procesamiento<br/>- Cálculo RIASEC<br/>- Cálculo Gardner<br/>- Cálculo Rendimiento"]
    end

    subgraph "Base de Datos - PostgreSQL"
        DB[("💾 PostgreSQL<br/>ovp_database")]
        TableUsers["Tabla: Users<br/>- id<br/>- name<br/>- email<br/>- password<br/>- role"]
        TableQuestions["Tabla: Questions<br/>- id<br/>- text<br/>- category<br/>- dimension"]
        TableResults["Tabla: TestResults<br/>- id<br/>- userId<br/>- predictedCareer<br/>- confidence<br/>- topCareers (JSONB)<br/>- profile (JSONB)<br/>- answers (JSONB)"]
    end

    subgraph "Almacenamiento Local"
        LocalStorage["📦 LocalStorage<br/>- JWT Token<br/>- User Data"]
    end

    %% Conexiones Frontend
    UI --> Router
    Router --> Pages
    Pages --> Components
    Pages --> Auth
    Pages --> Services
    Auth --> LocalStorage
    Services --> API

    %% Conexiones Backend
    API --> Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Models
    Models --> DB
    
    %% Conexiones Database
    DB --> TableUsers
    DB --> TableQuestions
    DB --> TableResults

    %% Conexiones ML
    Controllers --> MLScript
    MLScript --> MLModel
    MLScript --> Encoder
    MLScript --> Processing
    Processing -.->|Predicción| Controllers

    %% Estilos
    classDef frontend fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef database fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef ml fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef storage fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff

    class UI,Router,Auth,Pages,Components,Services frontend
    class API,Routes,Controllers,Middleware,Models backend
    class DB,TableUsers,TableQuestions,TableResults database
    class MLScript,MLModel,Encoder,Processing ml
    class LocalStorage storage
```

## Flujo de Datos Principal

```mermaid
sequenceDiagram
    actor User as 👤 Usuario
    participant UI as Frontend React
    participant API as Backend Express
    participant DB as PostgreSQL
    participant ML as Python ML

    %% Registro/Login
    rect rgb(200, 220, 255)
        note right of User: Autenticación
        User->>UI: Ingresa credenciales
        UI->>API: POST /api/auth/login
        API->>DB: Verificar usuario
        DB-->>API: Usuario válido
        API-->>UI: JWT Token
        UI->>UI: Guardar token en localStorage
    end

    %% Realizar Test
    rect rgb(220, 255, 220)
        note right of User: Cuestionario Vocacional
        User->>UI: Accede al test
        UI->>API: GET /api/questions<br/>(Auth: Bearer Token)
        API->>DB: Obtener 65 preguntas
        DB-->>API: Lista de preguntas
        API-->>UI: Preguntas (RIASEC + Gardner)
        User->>UI: Responde 65 preguntas<br/>(Escala Likert 1-5)
        UI->>UI: Valida respuestas completas
    end

    %% Predicción ML
    rect rgb(255, 220, 255)
        note right of User: Análisis y Predicción
        UI->>API: POST /api/test/predict<br/>(answers: {q1:5, q2:3, ...})
        API->>ML: Ejecuta predict.py<br/>(JSON con respuestas)
        ML->>ML: Calcula promedios RIASEC
        ML->>ML: Calcula promedios Gardner
        ML->>ML: Calcula Rendimiento
        ML->>ML: Random Forest predice
        ML->>ML: Calcula top 5 carreras
        ML-->>API: JSON con predicción completa
        API->>DB: INSERT TestResult<br/>(career, confidence, profile)
        DB-->>API: Test guardado (ID)
        API-->>UI: Resultado del test
        UI->>UI: Navega a página de resultados
    end

    %% Ver Historial
    rect rgb(255, 240, 200)
        note right of User: Historial de Tests
        User->>UI: Accede a historial
        UI->>API: GET /api/test/results<br/>(Auth: Bearer Token)
        API->>DB: SELECT tests WHERE userId
        DB-->>API: Lista de tests realizados
        API-->>UI: Historial completo
        UI->>User: Muestra tests con resultados
    end

    %% Certificado
    rect rgb(255, 220, 200)
        note right of User: Certificado PDF
        User->>UI: Click "Imprimir"
        UI->>UI: window.print()
        UI->>User: Certificado con gráficos<br/>(RIASEC + Gardner + Top 5)
    end
```

## Arquitectura de Capas

```mermaid
graph LR
    subgraph "Capa de Presentación"
        A1[Componentes React]
        A2[Páginas]
        A3[Estilos Tailwind]
    end

    subgraph "Capa de Lógica"
        B1[Context API]
        B2[Custom Hooks]
        B3[Servicios API]
    end

    subgraph "Capa de API"
        C1[Express Routes]
        C2[Controllers]
        C3[Middleware Auth]
    end

    subgraph "Capa de Negocio"
        D1[Sequelize Models]
        D2[Validaciones]
        D3[Lógica de Test]
    end

    subgraph "Capa de Datos"
        E1[(PostgreSQL)]
        E2[ML Models]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
    B1 --> C1
    B2 --> C2
    B3 --> C3
    C1 --> D1
    C2 --> D2
    C3 --> D3
    D1 --> E1
    D2 --> E1
    D3 --> E2
```

## Tecnologías Utilizadas

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool y dev server
- **React Router v6** - Navegación SPA
- **Tailwind CSS** - Estilos utility-first
- **Heroicons** - Iconos SVG
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Hash de contraseñas
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

### Machine Learning
- **Python 3.13.4** - Lenguaje de programación
- **scikit-learn** - Random Forest Classifier
- **pandas** - Manipulación de datos
- **numpy** - Operaciones numéricas
- **joblib** - Serialización de modelos

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **JSONB** - Almacenamiento flexible de resultados

## Flujo de Autenticación

```mermaid
stateDiagram-v2
    [*] --> NoAutenticado
    NoAutenticado --> Login: Usuario ingresa credenciales
    Login --> Validando: POST /api/auth/login
    Validando --> Autenticado: Credenciales válidas<br/>+ JWT Token
    Validando --> NoAutenticado: Credenciales inválidas
    Autenticado --> ProtectedRoute: Navega a ruta protegida
    ProtectedRoute --> VerificandoToken: Middleware valida JWT
    VerificandoToken --> AccesoConcedido: Token válido
    VerificandoToken --> NoAutenticado: Token inválido/expirado
    AccesoConcedido --> [*]
    Autenticado --> [*]: Logout (elimina token)
```

## Estructura de Datos del Test

```mermaid
erDiagram
    USERS ||--o{ TEST_RESULTS : realiza
    USERS {
        int id PK
        string name
        string email
        string password
        enum role
        datetime createdAt
    }
    
    TEST_RESULTS {
        int id PK
        int userId FK
        string predictedCareer
        float confidence
        jsonb topCareers
        jsonb profile
        jsonb answers
        datetime completedAt
    }
    
    QUESTIONS {
        int id PK
        text text
        string category
        string dimension
    }
    
    TEST_RESULTS ||--o{ QUESTIONS : responde
```

## Modelo de Datos JSONB

### topCareers (Array)
```json
[
  {
    "carrera": "Ingeniería de Software",
    "porcentaje": 85.5
  },
  {
    "carrera": "Ciencias de la Computación",
    "porcentaje": 82.3
  }
]
```

### profile (Object)
```json
{
  "R": 3.4,
  "I": 4.2,
  "A": 2.8,
  "S": 3.6,
  "E": 3.9,
  "C": 3.1,
  "LM": 4.5,
  "L": 3.8,
  "ES": 4.0,
  "M": 2.5,
  "CK": 3.2,
  "IP": 3.7,
  "IA": 4.1,
  "N": 3.3,
  "Rendimiento_General": 4,
  "Rendimiento_STEM": 5,
  "Rendimiento_Humanidades": 3
}
```

### answers (Object)
```json
{
  "q1": 4,
  "q2": 5,
  "q3": 3,
  "...": "...",
  "q65": 4
}
```

## Despliegue

```mermaid
graph TB
    subgraph "Desarrollo Local"
        DevFront["npm run dev<br/>Puerto 5173"]
        DevBack["npm start<br/>Puerto 5000"]
        DevDB["PostgreSQL<br/>Puerto 5432"]
    end

    subgraph "Producción (Ejemplo)"
        ProdFront["Vercel/Netlify<br/>Frontend estático"]
        ProdBack["Render/Railway<br/>Backend API"]
        ProdDB["PostgreSQL Cloud<br/>Supabase/Render"]
    end

    DevFront -.->|Build| ProdFront
    DevBack -.->|Deploy| ProdBack
    DevDB -.->|Migrate| ProdDB
```

## Seguridad

- ✅ JWT con expiración configurable
- ✅ Passwords hasheados con bcrypt
- ✅ Validación de roles (admin/student)
- ✅ Protected routes en frontend y backend
- ✅ CORS configurado
- ✅ Variables de entorno para secretos
- ✅ SQL injection prevention (Sequelize ORM)

## Escalabilidad

- ✅ Stateless API (JWT)
- ✅ JSONB para datos flexibles
- ✅ Connection pooling en PostgreSQL
- ✅ Modelo ML pre-entrenado (rápido)
- ✅ Frontend SPA optimizado con Vite
- ✅ Componentes React reutilizables

---

**Fecha de Documentación**: Noviembre 2025  
**Versión del Sistema**: 1.0.0

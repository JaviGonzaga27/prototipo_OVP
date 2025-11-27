# Guía de Ejecución de Pruebas - Sistema OVP

Este documento describe cómo ejecutar todas las pruebas definidas en el Plan de Pruebas del Sistema de Orientación Vocacional Profesional.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Pruebas Unitarias](#pruebas-unitarias)
4. [Pruebas de Integración](#pruebas-de-integración)
5. [Pruebas E2E](#pruebas-e2e)
6. [Pruebas de Rendimiento](#pruebas-de-rendimiento)
7. [Pruebas de Seguridad](#pruebas-de-seguridad)
8. [Pruebas de ML](#pruebas-de-ml)
9. [Reportes de Cobertura](#reportes-de-cobertura)

## 🔧 Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Python >= 3.8 (para pruebas ML)
- npm o yarn

## 📦 Instalación

### Frontend

```powershell
cd c:\Users\Kewo\Desktop\GIT_OVP\prototipo_OVP
npm install
```

### Backend

```powershell
cd c:\Users\Kewo\Desktop\GIT_OVP\prototipo_OVP\backend
npm install
```

## 🧪 Pruebas Unitarias

### Frontend (Vitest + React Testing Library)

```powershell
# Ejecutar todas las pruebas
npm test

# Modo watch (se ejecuta al guardar cambios)
npm run test:watch

# Con interfaz visual
npm run test:ui

# Con cobertura
npm run test:coverage
```

### Backend (Jest + Supertest)

```powershell
cd backend

# Todas las pruebas
npm test

# Pruebas específicas
npm run test:auth          # TC-001 a TC-004
npm run test:questionnaire # TC-005 a TC-008
npm run test:results       # TC-009 a TC-011
npm run test:admin         # TC-012 a TC-015

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

### Casos de Prueba Cubiertos

#### ✅ TC-001: Registro de usuario exitoso
- Ubicación: `backend/tests/auth.test.js`
- Comando: `npm run test:auth`
- Verifica: Registro con datos válidos, token JWT, encriptación de contraseña

#### ✅ TC-002: Registro con email duplicado
- Ubicación: `backend/tests/auth.test.js`
- Comando: `npm run test:auth`
- Verifica: Validación de email único, formato válido, longitud de contraseña

#### ✅ TC-003: Login exitoso
- Ubicación: `backend/tests/auth.test.js`
- Comando: `npm run test:auth`
- Verifica: Login con credenciales correctas, generación de JWT

#### ✅ TC-004: Login con credenciales incorrectas
- Ubicación: `backend/tests/auth.test.js`
- Comando: `npm run test:auth`
- Verifica: Manejo de errores, mensajes apropiados

#### ✅ TC-005: Cargar preguntas del test
- Ubicación: `backend/tests/questionnaire.test.js`
- Comando: `npm run test:questionnaire`
- Verifica: Carga de 65 preguntas, estructura correcta

#### ✅ TC-006: Navegar entre preguntas
- Ubicación: `backend/tests/questionnaire.test.js`
- Comando: `npm run test:questionnaire`
- Verifica: Navegación, persistencia de respuestas

#### ✅ TC-008: Completar test y enviar
- Ubicación: `backend/tests/questionnaire.test.js`
- Comando: `npm run test:questionnaire`
- Verifica: Envío de 65 respuestas, validaciones

#### ✅ TC-009: Predicción de carrera
- Ubicación: `backend/tests/results.test.js`
- Comando: `npm run test:results`
- Verifica: Generación de predicción ML, estructura, tiempo < 5s

#### ✅ TC-010: Visualización de resultados
- Ubicación: `backend/tests/results.test.js`
- Comando: `npm run test:results`
- Verifica: Carrera principal, confianza, top 5, RIASEC

#### ✅ TC-011: Ver historial de tests
- Ubicación: `backend/tests/results.test.js`
- Comando: `npm run test:results`
- Verifica: Acceso a historial, ordenamiento

#### ✅ TC-012: Acceso al panel administrativo
- Ubicación: `backend/tests/admin.test.js`
- Comando: `npm run test:admin`
- Verifica: Acceso de admins, estadísticas

#### ✅ TC-013: Bloqueo de acceso a no-admins
- Ubicación: `backend/tests/admin.test.js`
- Comando: `npm run test:admin`
- Verifica: Control de acceso basado en roles

#### ✅ TC-014: Gestionar usuarios
- Ubicación: `backend/tests/admin.test.js`
- Comando: `npm run test:admin`
- Verifica: CRUD de usuarios, cambio de roles

#### ✅ TC-015: Gestionar preguntas
- Ubicación: `backend/tests/admin.test.js`
- Comando: `npm run test:admin`
- Verifica: Edición de preguntas, validaciones

## 🔗 Pruebas de Integración

```powershell
cd backend
npm run test:integration
```

Verifica:
- Flujo completo: registro → login → test → resultados
- Integridad referencial en BD
- Integración con servicio ML
- Manejo de errores entre capas

## 🌐 Pruebas E2E (Cypress)

### Modo Interactivo (recomendado para desarrollo)

```powershell
npm run cypress
# o
npm run e2e:headed
```

### Modo Headless (para CI/CD)

```powershell
npm run e2e
```

### Pruebas Específicas

```powershell
# Solo autenticación
npx cypress run --spec "cypress/e2e/auth.cy.js"

# Solo cuestionario
npx cypress run --spec "cypress/e2e/questionnaire.cy.js"

# Solo resultados
npx cypress run --spec "cypress/e2e/results.cy.js"

# Solo admin
npx cypress run --spec "cypress/e2e/admin.cy.js"
```

### Casos E2E Cubiertos

- ✅ Flujo completo de registro y login
- ✅ Navegación entre preguntas con persistencia
- ✅ Envío de test y visualización de resultados
- ✅ Acceso a historial
- ✅ Panel administrativo y permisos

## ⚡ Pruebas de Rendimiento

```powershell
cd backend
npm run test:performance
```

### Métricas Verificadas

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| Tiempo de carga inicial | < 3s | Lighthouse |
| Tiempo respuesta API | < 200ms | Artillery |
| Predicción ML | < 5s | Artillery |
| Usuarios concurrentes | 100 | Artillery |

### Interpretar Resultados

El reporte mostrará:
- **p50, p95, p99**: Percentiles de tiempo de respuesta
- **Request rate**: Requests por segundo
- **Error rate**: Porcentaje de errores (debe ser < 1%)

✅ **Test pasa si:**
- p95 < 200ms
- p99 < 500ms
- Error rate < 1%

## 🔒 Pruebas de Seguridad

```powershell
cd backend
npm run test:security
```

### Verificaciones de Seguridad

#### ✅ Autenticación
- Contraseñas encriptadas con bcrypt
- Tokens JWT firmados y con expiración
- Validación de tokens en cada request

#### ✅ Autorización
- Control de acceso basado en roles
- Usuarios no acceden a datos de otros
- Admins tienen control total

#### ✅ Validación de Entrada
- Formato de email
- Longitud de contraseña
- Sanitización de inputs
- Prevención de inyección SQL

#### ✅ Protección de Datos
- Contraseñas nunca en respuestas
- Tokens no en logs
- Headers de seguridad

## 🤖 Pruebas de Machine Learning

```powershell
cd backend
npm run test:ml
```

### Casos de Prueba ML

#### TC-ML-001: Validación de entrada
- Rechaza formato incorrecto
- Valida rango 1-5
- Verifica 65 respuestas

#### TC-ML-002: Consistencia
- Mismas respuestas → misma predicción
- 100 predicciones idénticas

#### TC-ML-003: Tiempo de respuesta
- Carga de modelo < 5s
- Predicción < 5s
- 100 predicciones en tiempo razonable

#### TC-ML-004: Cobertura de carreras
- Puede recomendar diversas carreras
- Top 5 diferentes
- Ordenadas por porcentaje

## 📊 Reportes de Cobertura

### Frontend

```powershell
npm run test:coverage
```

Genera reporte en: `coverage/index.html`

### Backend

```powershell
cd backend
npm run test:coverage
```

Genera reporte en: `backend/coverage/index.html`

### Criterios de Aceptación

✅ **Cobertura mínima requerida: 70%**

- Branches: >= 70%
- Functions: >= 70%
- Lines: >= 70%
- Statements: >= 70%

## 🚀 Ejecución Completa de Todas las Pruebas

### Script PowerShell Completo

```powershell
# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Cyan
npm install
cd backend
npm install
cd ..

# Pruebas Backend
Write-Host "`nEjecutando pruebas backend..." -ForegroundColor Cyan
cd backend
npm test
npm run test:coverage

# Pruebas de seguridad
Write-Host "`nEjecutando pruebas de seguridad..." -ForegroundColor Cyan
npm run test:security

# Pruebas de ML
Write-Host "`nEjecutando pruebas ML..." -ForegroundColor Cyan
npm run test:ml

# Regresar al root
cd ..

# Pruebas Frontend
Write-Host "`nEjecutando pruebas frontend..." -ForegroundColor Cyan
npm run test:coverage

# Pruebas E2E
Write-Host "`nEjecutando pruebas E2E..." -ForegroundColor Cyan
npm run e2e

Write-Host "`n✅ Todas las pruebas completadas!" -ForegroundColor Green
```

Guardar como `run-all-tests.ps1` y ejecutar:

```powershell
.\run-all-tests.ps1
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'supertest'"

```powershell
cd backend
npm install
```

### Error: Base de datos no existe

```powershell
cd backend
npm run create-db
npm run init-db
```

### Error: Python no encontrado (pruebas ML)

Asegurar que Python está instalado y en PATH:

```powershell
python --version
pip install -r backend/ml/requirements.txt
```

### Cypress no abre

```powershell
npx cypress install --force
```

### Puerto en uso

Cambiar puerto en archivos de configuración o cerrar proceso:

```powershell
# Ver procesos en puerto 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Matar proceso
Stop-Process -Id <PID>
```

## 📝 Notas Importantes

1. **Base de datos de prueba**: Las pruebas usan la misma BD. Considerar crear BD separada para tests.

2. **Datos de prueba**: Algunos tests crean datos que luego limpian. Si fallan, pueden quedar datos residuales.

3. **Orden de ejecución**: Las pruebas E2E requieren que backend y frontend estén corriendo.

4. **Timeouts**: Algunas pruebas ML pueden tardar varios segundos. Los timeouts están configurados apropiadamente.

5. **CI/CD**: Para integración continua, usar comandos headless:
   ```powershell
   npm run test:coverage  # Frontend
   cd backend && npm run test:coverage  # Backend
   npm run e2e  # Cypress headless
   ```

## 📈 Métricas de Calidad

### Estado Actual de Implementación

| Categoría | Tests Implementados | Cobertura Esperada |
|-----------|---------------------|-------------------|
| Autenticación | 15 tests | 85% |
| Cuestionario | 12 tests | 80% |
| Resultados ML | 18 tests | 75% |
| Administración | 16 tests | 80% |
| Integración | 10 tests | 70% |
| Seguridad | 20 tests | 90% |
| E2E | 25 tests | - |
| **TOTAL** | **116 tests** | **>70%** |

## 🎯 Criterios de Aceptación Final

El sistema será aceptado cuando:

- ✅ Todas las pruebas de prioridad Alta pasen (TC-001 a TC-015)
- ✅ >= 90% de pruebas de prioridad Media pasen
- ✅ Cobertura de código >= 70%
- ✅ Accuracy del modelo ML >= 70%
- ✅ Tiempo de respuesta API < 200ms promedio
- ✅ Predicción ML < 5 segundos
- ✅ Sistema soporte 100 usuarios concurrentes
- ✅ Todas las verificaciones de seguridad OK
- ✅ Sin bugs críticos

## 📧 Soporte

Para dudas o problemas con las pruebas, contactar:
- Javier Gonzaga
- Francisco Terán

---

**Universidad de las Fuerzas Armadas - ESPE**  
**Departamento de Ciencias de la Computación**  
Noviembre 2025

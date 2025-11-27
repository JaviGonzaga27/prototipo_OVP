# ✅ Checklist de Verificación - Plan de Pruebas OVP

Use este checklist para verificar que todas las pruebas se ejecuten correctamente.

## 📋 Preparación del Entorno

- [ ] Node.js >= 18.x instalado
- [ ] PostgreSQL >= 14.x instalado y corriendo
- [ ] Python >= 3.8 instalado (para ML)
- [ ] Variables de entorno configuradas (.env)
- [ ] Base de datos creada e inicializada
- [ ] Dependencias instaladas (npm install)

### Comandos de Preparación

```powershell
# Verificar versiones
node --version        # Debe ser >= 18.x
npm --version
psql --version        # Debe ser >= 14.x
python --version      # Debe ser >= 3.8

# Instalar dependencias
npm install
cd backend && npm install && cd ..

# Configurar BD
cd backend
npm run create-db
npm run init-db
cd ..
```

---

## 🧪 Pruebas Unitarias - Backend

### TC-001 a TC-004: Autenticación

- [ ] Registro de usuario exitoso
- [ ] Contraseñas encriptadas con bcrypt
- [ ] Tokens JWT generados correctamente
- [ ] Registro con email duplicado rechazado
- [ ] Validación de formato de email
- [ ] Validación de longitud de contraseña
- [ ] Login exitoso con credenciales correctas
- [ ] Token JWT válido generado en login
- [ ] Login rechazado con contraseña incorrecta
- [ ] Login rechazado con email inexistente
- [ ] Validación de campos requeridos

**Comando:** `cd backend && npm run test:auth`

**Resultado esperado:** ✅ Todos los tests pasan

---

### TC-005, TC-006, TC-008: Test Vocacional

- [ ] Carga de 65 preguntas
- [ ] Estructura correcta de preguntas
- [ ] Requiere autenticación para acceder
- [ ] Rechaza token inválido
- [ ] Acepta test completo con 65 respuestas
- [ ] Rechaza test con menos de 65 respuestas
- [ ] Rechaza respuestas fuera del rango 1-5
- [ ] Guarda resultado en base de datos
- [ ] Asocia test con usuario correcto

**Comando:** `cd backend && npm run test:questionnaire`

**Resultado esperado:** ✅ Todos los tests pasan

---

### TC-009, TC-010, TC-011: Resultados y ML

- [ ] Genera predicción válida
- [ ] Predicción incluye carrera recomendada
- [ ] Confianza entre 0-100%
- [ ] Top 5 carreras retornadas
- [ ] Perfil RIASEC completo (R,I,A,S,E,C)
- [ ] Predicción en menos de 5 segundos
- [ ] Predicciones consistentes con mismas respuestas
- [ ] Obtiene resultado por ID
- [ ] No permite ver resultados de otros usuarios
- [ ] Retorna 404 para ID inexistente
- [ ] Obtiene historial de tests
- [ ] Tests ordenados por fecha (reciente primero)
- [ ] Solo muestra tests del usuario autenticado

**Comando:** `cd backend && npm run test:results`

**Resultado esperado:** ✅ Todos los tests pasan, predicción < 5s

---

### TC-012 a TC-015: Administración

- [ ] Admin accede a estadísticas
- [ ] Admin obtiene lista de usuarios
- [ ] Admin obtiene lista de preguntas
- [ ] Estudiante NO accede a estadísticas (403)
- [ ] Estudiante NO accede a lista usuarios (403)
- [ ] Usuario sin autenticar redirigido (401)
- [ ] Admin puede cambiar rol de usuario
- [ ] Admin puede ver detalles de usuario
- [ ] Admin puede eliminar usuario
- [ ] No permite roles inválidos
- [ ] Admin puede filtrar usuarios por rol
- [ ] Admin puede editar texto de pregunta
- [ ] Admin puede cambiar categoría de pregunta
- [ ] Admin puede crear nueva pregunta
- [ ] Admin puede eliminar pregunta
- [ ] Validación de campos al crear pregunta
- [ ] Estudiante NO puede modificar preguntas (403)

**Comando:** `cd backend && npm run test:admin`

**Resultado esperado:** ✅ Todos los tests pasan

---

## 🔗 Pruebas de Integración

- [ ] Flujo completo: registro → login → test → resultados
- [ ] Transacciones BD correctas
- [ ] Integridad referencial mantenida
- [ ] Servicio ML llamado correctamente
- [ ] Predicción guardada en BD
- [ ] Manejo de errores de BD
- [ ] Token expirado rechazado
- [ ] Validación de datos entre capas

**Comando:** `cd backend && npm run test:integration`

**Resultado esperado:** ✅ Todos los tests pasan

---

## 🔒 Pruebas de Seguridad

### Autenticación
- [ ] ✓ Contraseñas encriptadas con bcrypt
- [ ] ✓ Tokens JWT firmados correctamente
- [ ] ✓ Expiración de tokens configurada
- [ ] ✓ Validación de tokens en cada request

### Autorización
- [ ] ✓ Control de acceso basado en roles
- [ ] ✓ Verificación de permisos en backend
- [ ] ✓ Usuarios no acceden a datos de otros
- [ ] ✓ Admins tienen control total

### Validación de Entrada
- [ ] ✓ Validación de formato de email
- [ ] ✓ Validación de longitud de contraseña
- [ ] ✓ Sanitización de inputs
- [ ] ✓ Prevención de inyección SQL (ORM)

### Protección de Datos
- [ ] ✓ Contraseñas nunca en respuestas
- [ ] ✓ Tokens no en logs
- [ ] ✓ Headers de seguridad

**Comando:** `cd backend && npm run test:security`

**Resultado esperado:** ✅ Todas las verificaciones pasan

---

## 🤖 Pruebas de Machine Learning

### TC-ML-001: Validación de entrada
- [ ] Rechaza formato incorrecto
- [ ] Rechaza valores fuera de rango 1-5
- [ ] Acepta arrays de 65 números válidos
- [ ] Valida tipos de datos

### TC-ML-002: Consistencia
- [ ] Mismas respuestas → misma predicción
- [ ] 100 predicciones idénticas son consistentes

### TC-ML-003: Tiempo de respuesta
- [ ] Carga de modelo < 5 segundos
- [ ] Predicción individual < 5 segundos
- [ ] 100 predicciones en tiempo razonable

### TC-ML-004: Cobertura de carreras
- [ ] Puede recomendar diferentes carreras
- [ ] Top 5 carreras son diferentes
- [ ] Top 5 ordenadas por porcentaje
- [ ] Suma de porcentajes <= 100%

**Comando:** `cd backend && npm run test:ml`

**Resultado esperado:** ✅ Todos los tests pasan, tiempos < 5s

---

## 🌐 Pruebas E2E (End-to-End)

### ⚠️ Requisito: Backend y Frontend deben estar corriendo

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Tests
npm run e2e
```

### Autenticación
- [ ] Registro exitoso
- [ ] Mensaje de bienvenida
- [ ] Error con email duplicado
- [ ] Validación de formato email
- [ ] Validación longitud contraseña
- [ ] Login exitoso
- [ ] Redirección después de login
- [ ] Sesión persistente al recargar
- [ ] Error con contraseña incorrecta
- [ ] Error con email inexistente
- [ ] Logout correcto

**Comando:** `npx cypress run --spec "cypress/e2e/auth.cy.js"`

---

### Cuestionario
- [ ] Carga de preguntas
- [ ] Indicador de progreso 1/65
- [ ] Opciones de respuesta 1-5
- [ ] Botón "Siguiente" visible
- [ ] Avanzar a siguiente pregunta
- [ ] Retroceder a pregunta anterior
- [ ] Respuestas persisten al navegar
- [ ] Barra de progreso actualizada
- [ ] Guardar en localStorage
- [ ] Recuperar progreso al recargar
- [ ] Resumen en pregunta 65
- [ ] Envío exitoso de test
- [ ] Loading indicator visible
- [ ] Redirección a resultados
- [ ] localStorage limpio después de enviar

**Comando:** `npx cypress run --spec "cypress/e2e/questionnaire.cy.js"`

---

### Resultados
- [ ] Carrera principal visible
- [ ] Nivel de confianza 0-100%
- [ ] Top 5 carreras mostradas
- [ ] Gráfico RIASEC visible
- [ ] 6 dimensiones RIASEC (R,I,A,S,E,C)
- [ ] Botones descargar/compartir
- [ ] Predicción < 5 segundos
- [ ] Descripción de carrera
- [ ] Acceso a historial
- [ ] Lista de tests en historial
- [ ] Fecha y carrera en cada test
- [ ] Ver detalle de test anterior
- [ ] Tests ordenados por fecha
- [ ] Mensaje si no hay tests

**Comando:** `npx cypress run --spec "cypress/e2e/results.cy.js"`

---

### Administración
- [ ] Admin accede al panel
- [ ] Estadísticas generales visibles
- [ ] Lista de usuarios mostrada
- [ ] Gestión de preguntas visible
- [ ] Navegación entre secciones
- [ ] Estudiante NO accede (error/redirección)
- [ ] Usuario sin auth redirigido a login
- [ ] No hay opción admin para estudiantes
- [ ] Ver lista de todos usuarios
- [ ] Información completa de cada usuario
- [ ] Cambiar rol de usuario
- [ ] Ver detalles de usuario
- [ ] Buscar usuarios
- [ ] Filtrar por rol
- [ ] Eliminar usuario
- [ ] Lista de preguntas mostrada
- [ ] Texto y categoría visibles
- [ ] Editar texto de pregunta
- [ ] Cambiar categoría
- [ ] Crear nueva pregunta
- [ ] Validación al crear
- [ ] Eliminar pregunta
- [ ] Buscar preguntas
- [ ] Filtrar por categoría

**Comando:** `npx cypress run --spec "cypress/e2e/admin.cy.js"`

---

## ⚡ Pruebas de Rendimiento

### ⚠️ Requisito: Backend debe estar corriendo

```powershell
cd backend
npm run dev

# En otra terminal
npm run test:performance
```

### Métricas a Verificar

- [ ] p95 < 200ms (95% de requests)
- [ ] p99 < 500ms (99% de requests)
- [ ] Error rate < 1%
- [ ] Sistema soporta 100 usuarios concurrentes
- [ ] No hay errores bajo carga

**Resultado esperado:** ✅ Todas las métricas dentro de objetivos

---

## 📊 Reportes de Cobertura

### Backend

```powershell
cd backend
npm run test:coverage
```

- [ ] Cobertura Lines >= 70%
- [ ] Cobertura Functions >= 70%
- [ ] Cobertura Branches >= 70%
- [ ] Cobertura Statements >= 70%
- [ ] Reporte HTML generado en `backend/coverage/index.html`

### Frontend

```powershell
npm run test:coverage
```

- [ ] Cobertura Lines >= 70%
- [ ] Cobertura Functions >= 70%
- [ ] Cobertura Branches >= 70%
- [ ] Cobertura Statements >= 70%
- [ ] Reporte HTML generado en `coverage/index.html`

---

## 🎯 Criterios de Aceptación Final

### Funcionales
- [ ] ✅ Todas las pruebas de prioridad Alta pasan (TC-001 a TC-015)
- [ ] ✅ >= 90% de pruebas de prioridad Media pasan
- [ ] ✅ Cobertura de código >= 70% en componentes críticos

### No Funcionales
- [ ] ✅ Accuracy del modelo ML >= 70%
- [ ] ✅ Tiempo de respuesta API < 200ms promedio
- [ ] ✅ Tiempo de predicción ML < 5 segundos
- [ ] ✅ Sistema soporta 100 usuarios concurrentes sin errores

### Seguridad
- [ ] ✅ Todas las verificaciones de seguridad implementadas
- [ ] ✅ Control de acceso funciona correctamente
- [ ] ✅ Datos sensibles protegidos

### Calidad
- [ ] ✅ Interfaz responsive (móvil, tablet, escritorio)
- [ ] ✅ No hay bugs críticos sin resolver
- [ ] ✅ Documentación técnica completa

---

## 🚀 Ejecución Completa Automatizada

Para ejecutar todas las pruebas de una vez:

```powershell
.\run-all-tests.ps1
```

Este script ejecutará automáticamente:
1. ✅ Instalación de dependencias
2. ✅ Pruebas backend (auth, questionnaire, results, admin, integration)
3. ✅ Pruebas de seguridad
4. ✅ Pruebas de ML
5. ✅ Cobertura backend
6. ✅ Pruebas frontend (si existen)
7. ⚠️ Pruebas E2E (opcional, requiere confirmación)
8. 📊 Resumen de resultados

---

## 📝 Notas y Problemas Comunes

### ❌ Error: "Cannot find module"
**Solución:** `npm install` en directorio correspondiente

### ❌ Error: Base de datos no existe
**Solución:** 
```powershell
cd backend
npm run create-db
npm run init-db
```

### ❌ Error: Puerto en uso
**Solución:**
```powershell
# Ver proceso en puerto 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
# Matar proceso
Stop-Process -Id <PID>
```

### ❌ Cypress no abre
**Solución:** `npx cypress install --force`

### ❌ Tests ML fallan
**Solución:**
```powershell
cd backend/ml
pip install -r requirements.txt
```

---

## ✅ Firma de Verificación

**Fecha de ejecución:** _______________

**Ejecutado por:** _______________

**Resultado general:**
- [ ] ✅ Todas las pruebas pasaron
- [ ] ⚠️ Algunas pruebas fallaron (documentar)
- [ ] ❌ Errores críticos encontrados

**Cobertura alcanzada:**
- Backend: ______%
- Frontend: ______%

**Observaciones:**
_______________________________________________
_______________________________________________
_______________________________________________

---

**Universidad de las Fuerzas Armadas - ESPE**  
**Departamento de Ciencias de la Computación**  
Noviembre 2025

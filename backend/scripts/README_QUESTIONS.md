# Script de Población de Preguntas del Test Vocacional

Este script inserta las 65 preguntas del test vocacional en la base de datos.

## Estructura de Preguntas

### RIASEC (30 preguntas)
- **R - Realista** (5 preguntas): Práctico/Manual
- **I - Investigativo** (5 preguntas): Analítico/Científico
- **A - Artístico** (5 preguntas): Creativo/Expresivo
- **S - Social** (5 preguntas): Ayuda/Enseñanza
- **E - Emprendedor** (5 preguntas): Liderazgo/Persuasión
- **C - Convencional** (5 preguntas): Organización/Detalle

### Gardner (32 preguntas)
- **LM - Lógico-Matemática** (4 preguntas)
- **L - Lingüística** (4 preguntas)
- **ES - Espacial** (4 preguntas)
- **M - Musical** (4 preguntas)
- **CK - Corporal-Kinestésica** (4 preguntas)
- **IP - Interpersonal** (4 preguntas)
- **IA - Intrapersonal** (4 preguntas)
- **N - Naturalista** (4 preguntas)

### Rendimiento Académico (3 preguntas)
- **General** (1 pregunta)
- **STEM** (1 pregunta)
- **Humanidades** (1 pregunta)

## Escala de Respuestas

### RIASEC y Gardner (1-5)
- **1** = Nada (No me interesa en absoluto)
- **2** = Poco (Me interesa ligeramente)
- **3** = Moderado (Me interesa en nivel medio)
- **4** = Mucho (Me interesa bastante)
- **5** = Totalmente (Me apasiona)

### Rendimiento Académico (1-5)
- **1** = Deficiente
- **2** = Regular
- **3** = Bueno
- **4** = Muy Bueno
- **5** = Sobresaliente

## Uso del Script

### 1. Ejecutar el script de población

```bash
cd backend
node scripts/populateQuestions.js
```

### 2. Verificar en la base de datos

```sql
-- Ver todas las preguntas
SELECT id, category, dimension, "order", text FROM "Questions" ORDER BY "order";

-- Contar por categoría
SELECT category, COUNT(*) FROM "Questions" GROUP BY category;

-- Ver preguntas de una dimensión específica
SELECT * FROM "Questions" WHERE dimension = 'R' ORDER BY "order";
```

## Endpoints API Disponibles

### Para Estudiantes

#### GET `/api/questions`
Obtiene todas las preguntas activas ordenadas.

**Respuesta:**
```json
{
  "success": true,
  "count": 65,
  "questions": [...]
}
```

#### GET `/api/questions/grouped`
Obtiene preguntas agrupadas por categoría y dimensión.

**Respuesta:**
```json
{
  "success": true,
  "total": 65,
  "grouped": {
    "RIASEC": {
      "R": [...],
      "I": [...],
      "A": [...],
      "S": [...],
      "E": [...],
      "C": [...]
    },
    "Gardner": {
      "LM": [...],
      "L": [...],
      "ES": [...],
      "M": [...],
      "CK": [...],
      "IP": [...],
      "IA": [...],
      "N": [...]
    },
    "Rendimiento": {
      "General": [...],
      "STEM": [...],
      "Humanidades": [...]
    }
  }
}
```

### Para Administradores

- **GET** `/api/questions/all` - Todas las preguntas (incluidas inactivas)
- **GET** `/api/questions/:id` - Pregunta por ID
- **POST** `/api/questions` - Crear nueva pregunta
- **PUT** `/api/questions/:id` - Actualizar pregunta
- **DELETE** `/api/questions/:id` - Eliminar pregunta
- **PATCH** `/api/questions/:id/toggle` - Activar/desactivar pregunta

## Integración con Frontend

### Ejemplo de uso en React

```javascript
// Obtener preguntas agrupadas
const fetchQuestions = async () => {
  try {
    const response = await fetch('/api/questions/grouped', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (data.success) {
      setQuestions(data.grouped);
    }
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
  }
};

// Renderizar preguntas RIASEC
{questions.RIASEC.R.map((question) => (
  <QuestionCard
    key={question.id}
    question={question}
    onAnswer={handleAnswer}
  />
))}
```

## Modelo de Datos

```javascript
{
  id: Number,
  text: String,              // Texto de la pregunta
  options: Array,            // Opciones de respuesta
  category: String,          // RIASEC, Gardner, Rendimiento
  dimension: String,         // R, I, A, S, E, C, LM, L, ES, M, CK, IP, IA, N, General, STEM, Humanidades
  order: Number,             // Orden de la pregunta (1-65)
  isActive: Boolean,         // Estado activo/inactivo
  scaleMin: Number,          // Valor mínimo (1)
  scaleMax: Number,          // Valor máximo (5)
  scaleLabels: Object        // Etiquetas de la escala
}
```

## Notas Importantes

1. **Orden de las preguntas**: Las preguntas están numeradas del 1 al 65 en el orden del test vocacional original.

2. **Opciones de respuesta**: Todas las preguntas tienen 5 opciones de respuesta en formato de escala Likert.

3. **Categorías y dimensiones**: Permite agrupar y filtrar preguntas fácilmente.

4. **Estado activo**: Permite desactivar preguntas temporalmente sin eliminarlas.

5. **Autenticación**: Todos los endpoints requieren autenticación JWT.

## Solución de Problemas

### Error de conexión a la base de datos
Verifica que PostgreSQL esté corriendo y las credenciales en `config/database.js` sean correctas.

### Las preguntas no se insertan
Asegúrate de que el modelo `Question` esté sincronizado con la base de datos.

### Error en el frontend
Verifica que el token JWT esté siendo enviado correctamente en los headers.

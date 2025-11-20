# Integración del Modelo de Machine Learning

Este directorio contiene la integración del modelo Random Forest entrenado para predicción de carreras vocacionales.

## Archivos

- **`modelo_random_forest.pkl`**: Modelo Random Forest entrenado con 200 árboles
- **`label_encoder.pkl`**: Codificador de etiquetas para las carreras
- **`predict.py`**: Script Python para realizar predicciones
- **`mlService.js`**: Servicio Node.js que ejecuta el script Python
- **`README.md`**: Esta documentación

## Requisitos

### Python
Asegúrate de tener Python instalado con las siguientes librerías:

```bash
pip install pandas numpy scikit-learn joblib
```

### Node.js
El servicio usa `child_process` de Node.js (incluido por defecto).

## Uso del API

### Endpoint de Predicción

**POST** `/api/test/predict`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body (Opción 1 - Respuestas Individuales):**
```json
{
  "answers": {
    "q1": 3,
    "q2": 4,
    "q3": 5,
    ...
    "q65": 3
  }
}
```

**Body (Opción 2 - Promedios Calculados):**
```json
{
  "answers": {
    "R": 3.2,
    "I": 2.8,
    "A": 4.0,
    "S": 3.5,
    "E": 3.1,
    "C": 2.9,
    "LM": 3.7,
    "L": 4.2,
    "ES": 3.9,
    "M": 0.4,
    "CK": 2.8,
    "IP": 3.0,
    "IA": 2.7,
    "N": 3.4,
    "Rendimiento_General": 3,
    "Rendimiento_STEM": 1,
    "Rendimiento_Humanidades": 4
  }
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Predicción realizada exitosamente",
  "prediction": {
    "id": 123,
    "carrera_recomendada": "Ingeniería en Sistemas",
    "confianza": 85.32,
    "top_5_carreras": [
      {
        "carrera": "Ingeniería en Sistemas",
        "probabilidad": 0.8532,
        "porcentaje": 85.32
      },
      {
        "carrera": "Ingeniería en Software",
        "probabilidad": 0.7821,
        "porcentaje": 78.21
      },
      {
        "carrera": "Ciencias de la Computación",
        "probabilidad": 0.6543,
        "porcentaje": 65.43
      },
      {
        "carrera": "Ingeniería Informática",
        "probabilidad": 0.5432,
        "porcentaje": 54.32
      },
      {
        "carrera": "Matemáticas Aplicadas",
        "probabilidad": 0.4321,
        "porcentaje": 43.21
      }
    ],
    "perfil": {
      "R": 3.2,
      "I": 2.8,
      "A": 4.0,
      "S": 3.5,
      "E": 3.1,
      "C": 2.9,
      "LM": 3.7,
      "L": 4.2,
      "ES": 3.9,
      "M": 0.4,
      "CK": 2.8,
      "IP": 3.0,
      "IA": 2.7,
      "N": 3.4,
      "Rendimiento_General": 3,
      "Rendimiento_STEM": 1,
      "Rendimiento_Humanidades": 4
    },
    "completedAt": "2025-11-20T10:30:00.000Z"
  }
}
```

**Respuesta de Error (400/500):**
```json
{
  "success": false,
  "message": "Error al realizar predicción",
  "error": "Descripción del error"
}
```

## Formato de Respuestas

### Respuestas Individuales (q1-q65)

Las 65 preguntas del test se envían con claves `q1`, `q2`, ..., `q65`:

- **q1-q30**: RIASEC (6 dimensiones × 5 preguntas)
  - q1-q5: R (Realista)
  - q6-q10: I (Investigativo)
  - q11-q15: A (Artístico)
  - q16-q20: S (Social)
  - q21-q25: E (Emprendedor)
  - q26-q30: C (Convencional)

- **q31-q62**: Gardner (8 dimensiones × 4 preguntas)
  - q31-q34: LM (Lógico-Matemática)
  - q35-q38: L (Lingüística)
  - q39-q42: ES (Espacial)
  - q43-q46: M (Musical)
  - q47-q50: CK (Corporal-Kinestésica)
  - q51-q54: IP (Interpersonal)
  - q55-q58: IA (Intrapersonal)
  - q59-q62: N (Naturalista)

- **q63-q65**: Rendimiento Académico
  - q63: Rendimiento General
  - q64: Rendimiento STEM
  - q65: Rendimiento Humanidades

Todos los valores deben estar entre **1 y 5**.

### Promedios Calculados

Si el frontend ya calculó los promedios, se pueden enviar directamente:

```javascript
{
  "R": 3.2,    // Promedio de q1-q5
  "I": 2.8,    // Promedio de q6-q10
  "A": 4.0,    // Promedio de q11-q15
  "S": 3.5,    // Promedio de q16-q20
  "E": 3.1,    // Promedio de q21-q25
  "C": 2.9,    // Promedio de q26-q30
  "LM": 3.7,   // Promedio de q31-q34
  "L": 4.2,    // Promedio de q35-q38
  "ES": 3.9,   // Promedio de q39-q42
  "M": 0.4,    // Promedio de q43-q46
  "CK": 2.8,   // Promedio de q47-q50
  "IP": 3.0,   // Promedio de q51-q54
  "IA": 2.7,   // Promedio de q55-q58
  "N": 3.4,    // Promedio de q59-q62
  "Rendimiento_General": 3,     // q63
  "Rendimiento_STEM": 1,        // q64
  "Rendimiento_Humanidades": 4  // q65
}
```

## Ejemplo de Uso en React

```javascript
// services/test.js
export const predictCareer = async (answers, token) => {
  try {
    const response = await fetch('/api/test/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.prediction;
  } catch (error) {
    console.error('Error en predicción:', error);
    throw error;
  }
};

// En tu componente
const handleSubmitTest = async () => {
  try {
    setLoading(true);
    
    // Opción 1: Enviar respuestas individuales
    const answers = {
      q1: 3, q2: 4, q3: 5, ...
    };
    
    // Opción 2: Enviar promedios calculados
    // const answers = {
    //   R: 3.2, I: 2.8, ...
    // };
    
    const prediction = await predictCareer(answers, token);
    
    // Mostrar resultados
    console.log('Carrera recomendada:', prediction.carrera_recomendada);
    console.log('Confianza:', prediction.confianza + '%');
    console.log('Top 5:', prediction.top_5_carreras);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

## Flujo de Datos

```
Frontend (React)
    ↓
    | POST /api/test/predict
    | { answers: {...} }
    ↓
Backend (Node.js)
    ↓
    | mlService.js
    | - Valida respuestas
    | - Ejecuta predict.py
    ↓
Python Script (predict.py)
    ↓
    | - Carga modelo_random_forest.pkl
    | - Carga label_encoder.pkl
    | - Calcula promedios (si es necesario)
    | - Realiza predicción
    | - Devuelve JSON
    ↓
Backend (Node.js)
    ↓
    | - Guarda en TestResult
    | - Devuelve respuesta
    ↓
Frontend (React)
    ↓
    | Muestra resultados al usuario
```

## Base de Datos

Los resultados se guardan en la tabla `TestResults` con los siguientes campos:

- `id`: ID único del test
- `userId`: ID del usuario que realizó el test
- `answers`: Respuestas originales (JSONB)
- `predictedCareer`: Carrera recomendada (STRING)
- `confidence`: Nivel de confianza 0-1 (FLOAT)
- `topCareers`: Top 5 carreras con probabilidades (JSONB)
- `profile`: Perfil del estudiante (JSONB)
- `completedAt`: Fecha de completado (TIMESTAMP)

## Solución de Problemas

### Error: Python no encontrado
```bash
# Windows
where python

# Linux/Mac
which python3
```

Asegúrate de que Python esté en el PATH del sistema.

### Error: No se encuentra el módulo joblib
```bash
pip install joblib
```

### Error: Modelo no encontrado
Verifica que los archivos `.pkl` estén en `backend/ml/`:
```bash
ls backend/ml/
# Debe mostrar:
# - modelo_random_forest.pkl
# - label_encoder.pkl
# - predict.py
# - mlService.js
```

### Error: Permisos en predict.py (Linux/Mac)
```bash
chmod +x backend/ml/predict.py
```

## Actualizar el Modelo

Para actualizar el modelo con uno nuevo:

1. Entrena el nuevo modelo en Jupyter
2. Guarda los archivos `.pkl`
3. Copia a `backend/ml/`:
```bash
cp datasets/modelo_random_forest.pkl backend/ml/
cp datasets/label_encoder.pkl backend/ml/
```
4. Reinicia el servidor Node.js

## Métricas del Modelo Actual

- **Accuracy**: ~85-90%
- **Algoritmo**: Random Forest (200 árboles)
- **Features**: 17 (RIASEC + Gardner + Rendimiento)
- **Carreras**: 25 opciones
- **Dataset**: 250 registros sintéticos

## Próximos Pasos

- [ ] Implementar caché de predicciones
- [ ] Agregar logging detallado
- [ ] Implementar reentrenamiento automático
- [ ] Agregar más métricas de confianza
- [ ] Implementar A/B testing de modelos

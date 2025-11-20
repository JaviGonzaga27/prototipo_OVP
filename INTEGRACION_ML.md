# Guía de Instalación y Configuración del Modelo ML

## ✅ Resumen de Integración Completada

Se ha integrado exitosamente el modelo Random Forest entrenado en tu backend. Aquí está todo lo implementado:

### 📁 Archivos Creados

1. **`backend/ml/modelo_random_forest.pkl`** - Modelo entrenado
2. **`backend/ml/label_encoder.pkl`** - Codificador de etiquetas
3. **`backend/ml/predict.py`** - Script Python para predicciones
4. **`backend/ml/mlService.js`** - Servicio Node.js
5. **`backend/ml/requirements.txt`** - Dependencias Python
6. **`backend/ml/test_predict.py`** - Script de pruebas
7. **`backend/ml/README.md`** - Documentación completa

### 🔧 Cambios en el Backend

1. **`models/Question.js`** - Actualizado con campos de dimensión
2. **`models/TestResult.js`** - Agregados campos para predicción ML
3. **`controllers/testController.js`** - Nuevo endpoint `predictCareer()`
4. **`routes/testRoutes.js`** - Nueva ruta `POST /api/test/predict`
5. **`scripts/populateQuestions.js`** - Script para insertar 65 preguntas

---

## 🚀 Pasos de Instalación

### 1. Instalar Dependencias de Python

Abre una terminal PowerShell y ejecuta:

```powershell
# Ir al directorio del backend
cd C:\Users\Kewo\Desktop\GIT_OVP\prototipo_OVP\backend\ml

# Instalar dependencias
pip install pandas numpy scikit-learn joblib
```

O si tienes `requirements.txt`:

```powershell
pip install -r requirements.txt
```

### 2. Verificar la Instalación

```powershell
python -c "import pandas, numpy, sklearn, joblib; print('✅ Todas las librerías instaladas correctamente')"
```

### 3. Probar el Modelo

```powershell
cd C:\Users\Kewo\Desktop\GIT_OVP\prototipo_OVP\backend\ml
python test_predict.py
```

Deberías ver algo como:

```
🧪 PRUEBA DEL MODELO DE PREDICCIÓN

======================================================================
TEST 1: Respuestas Individuales
======================================================================
✅ Modelos cargados correctamente

📊 Promedios calculados:
{
  "R": 3.6,
  "I": 4.6,
  ...
}

✅ Predicción exitosa!

🏆 Carrera Recomendada: Ingeniería en Sistemas
📈 Confianza: 85.32%

📊 Top 5 Carreras:
   1. Ingeniería en Sistemas              85.32%
   2. Ingeniería en Software              78.21%
   ...
```

### 4. Poblar la Base de Datos con Preguntas

```powershell
cd C:\Users\Kewo\Desktop\GIT_OVP\prototipo_OVP\backend
node scripts/populateQuestions.js
```

### 5. Iniciar el Servidor Backend

```powershell
cd C:\Users\Kewo\Desktop\GIT_OVP\prototipo_OVP\backend
npm start
```

---

## 📡 Uso del API

### Endpoint de Predicción

**URL:** `POST http://localhost:5000/api/test/predict`

**Headers:**
```
Authorization: Bearer {tu_token_jwt}
Content-Type: application/json
```

**Body (Opción 1 - 65 Respuestas Individuales):**
```json
{
  "answers": {
    "q1": 3,
    "q2": 4,
    "q3": 5,
    "q4": 3,
    ...
    "q65": 4
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
    "Rendimiento_STEM": 5,
    "Rendimiento_Humanidades": 3
  }
}
```

---

## 💻 Ejemplo de Integración en React

### 1. Crear Servicio de Test

```javascript
// src/services/test.js

export const predictCareer = async (answers) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:5000/api/test/predict', {
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

export const getMyTestResults = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:5000/api/test/my-results', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    throw error;
  }
};
```

### 2. Usar en Componente de Cuestionario

```javascript
// src/pages/Questionnaire/index.jsx

import { useState } from 'react';
import { predictCareer } from '../../services/test';
import { useNavigate } from 'react-router-dom';

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [`q${questionId}`]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Realizar predicción
      const prediction = await predictCareer(answers);
      
      // Navegar a resultados con la predicción
      navigate('/results', { 
        state: { prediction } 
      });
      
    } catch (error) {
      alert('Error al procesar el test: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="questionnaire">
      <h1>Test Vocacional</h1>
      
      {/* Renderizar preguntas */}
      {questions.map((question) => (
        <div key={question.id} className="question">
          <p>{question.text}</p>
          <div className="options">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer(question.order, value)}
                className={answers[`q${question.order}`] === value ? 'active' : ''}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button 
        onClick={handleSubmit} 
        disabled={loading || Object.keys(answers).length < 65}
      >
        {loading ? 'Procesando...' : 'Ver Resultados'}
      </button>
    </div>
  );
};

export default Questionnaire;
```

### 3. Mostrar Resultados

```javascript
// src/pages/Results/index.jsx

import { useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const { prediction } = location.state || {};

  if (!prediction) {
    return <div>No hay resultados disponibles</div>;
  }

  return (
    <div className="results">
      <h1>Tus Resultados</h1>
      
      <div className="main-result">
        <h2>Carrera Recomendada</h2>
        <h3>{prediction.carrera_recomendada}</h3>
        <p>Confianza: {prediction.confianza}%</p>
      </div>

      <div className="top-careers">
        <h2>Top 5 Carreras Compatibles</h2>
        {prediction.top_5_carreras.map((career, index) => (
          <div key={index} className="career-card">
            <span className="rank">#{index + 1}</span>
            <span className="name">{career.carrera}</span>
            <span className="percentage">{career.porcentaje}%</span>
            <div 
              className="progress-bar" 
              style={{ width: `${career.porcentaje}%` }}
            />
          </div>
        ))}
      </div>

      <div className="profile">
        <h2>Tu Perfil Vocacional</h2>
        <h3>RIASEC</h3>
        <ul>
          <li>Realista: {prediction.perfil.R}</li>
          <li>Investigativo: {prediction.perfil.I}</li>
          <li>Artístico: {prediction.perfil.A}</li>
          <li>Social: {prediction.perfil.S}</li>
          <li>Emprendedor: {prediction.perfil.E}</li>
          <li>Convencional: {prediction.perfil.C}</li>
        </ul>
      </div>
    </div>
  );
};

export default Results;
```

---

## 🔍 Verificación y Pruebas

### Probar con Postman o Thunder Client

1. **Login primero:**
```
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@test.com", "password": "admin123" }
```

Copia el token de la respuesta.

2. **Hacer predicción:**
```
POST http://localhost:5000/api/test/predict
Headers: 
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body: {
  "answers": {
    "q1": 3, "q2": 4, "q3": 5, ... "q65": 4
  }
}
```

---

## 📊 Estructura de Datos

### Respuestas Guardadas en la BD

```sql
-- Estructura de TestResults
{
  id: 1,
  userId: 5,
  answers: {
    q1: 3, q2: 4, ... q65: 4
  },
  predictedCareer: "Ingeniería en Sistemas",
  confidence: 0.8532,
  topCareers: [
    { carrera: "Ingeniería en Sistemas", probabilidad: 0.8532, porcentaje: 85.32 },
    ...
  ],
  profile: {
    R: 3.2, I: 4.6, A: 2.2, ...
  },
  completedAt: "2025-11-20T10:30:00.000Z"
}
```

---

## ❗ Solución de Problemas Comunes

### 1. Error: "ModuleNotFoundError: No module named 'pandas'"

```powershell
pip install pandas numpy scikit-learn joblib
```

### 2. Error: "Python no encontrado"

Verifica que Python esté instalado:
```powershell
python --version
```

Si no está instalado, descarga desde: https://www.python.org/downloads/

### 3. Error: "Modelo no encontrado"

Verifica que los archivos `.pkl` estén en `backend/ml/`:
```powershell
ls backend/ml/
```

Debe mostrar:
- modelo_random_forest.pkl
- label_encoder.pkl

### 4. Error: "Falta la respuesta q45"

Asegúrate de enviar las 65 respuestas (q1 a q65) con valores entre 1 y 5.

### 5. Error de autenticación

Verifica que el token JWT sea válido y esté en el header:
```
Authorization: Bearer {token}
```

---

## 📚 Documentación Adicional

- **README.md del ML**: `backend/ml/README.md`
- **README de Preguntas**: `backend/scripts/README_QUESTIONS.md`
- **Notebook de Entrenamiento**: `datasets/dataset1.ipynb`

---

## 🎯 Próximos Pasos

1. ✅ Instalar dependencias Python
2. ✅ Probar el modelo con `test_predict.py`
3. ✅ Poblar preguntas en la BD
4. ✅ Iniciar el servidor backend
5. ⬜ Integrar en el frontend React
6. ⬜ Probar el flujo completo end-to-end
7. ⬜ Agregar validaciones y manejo de errores
8. ⬜ Implementar loading states
9. ⬜ Diseñar página de resultados
10. ⬜ Deploy a producción

---

## 📧 Soporte

Si encuentras problemas, verifica:
1. Que Python esté instalado y en el PATH
2. Que las librerías estén instaladas
3. Que los archivos .pkl existan en `backend/ml/`
4. Que el servidor backend esté corriendo
5. Que el token JWT sea válido

¡Éxito con tu proyecto! 🚀

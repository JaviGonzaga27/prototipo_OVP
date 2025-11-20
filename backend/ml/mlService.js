import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Servicio de Machine Learning para predicción de carreras
 */
class MLService {
  constructor() {
    this.pythonScript = path.join(__dirname, 'predict.py');
  }

  /**
   * Realiza una predicción de carrera basada en las respuestas del test
   * @param {Object} respuestas - Respuestas del test (puede ser respuestas individuales o promedios)
   * @returns {Promise<Object>} - Resultado de la predicción
   */
  async predecir(respuestas) {
    return new Promise((resolve, reject) => {
      // Ejecutar script de Python
      const pythonProcess = spawn('python', [this.pythonScript]);
      
      let outputData = '';
      let errorData = '';

      // Capturar salida estándar
      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      // Capturar errores
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      // Manejar finalización del proceso
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('❌ Python script falló con código:', code);
          console.error('Error output:', errorData);
          console.error('Standard output:', outputData);
          return reject(new Error(`Error en predicción Python (código ${code}): ${errorData}`));
        }

        try {
          // Limpiar warnings de scikit-learn antes de parsear JSON
          const lines = outputData.split('\n');
          const jsonLines = lines.filter(line => 
            !line.includes('InconsistentVersionWarning') &&
            !line.includes('warnings.warn') &&
            !line.includes('sklearn') &&
            line.trim().length > 0
          );
          const cleanOutput = jsonLines.join('\n');
          
          const resultado = JSON.parse(cleanOutput);
          
          if (!resultado.success) {
            return reject(new Error(resultado.error || 'Error desconocido en predicción'));
          }
          
          console.log('✅ Predicción exitosa desde Python');
          resolve(resultado);
        } catch (error) {
          console.error('❌ Error al parsear resultado de Python:', error.message);
          console.error('Output recibido:', outputData);
          reject(new Error(`Error al parsear resultado de Python: ${error.message}`));
        }
      });

      // Manejar errores del proceso
      pythonProcess.on('error', (error) => {
        reject(new Error(`Error al ejecutar Python: ${error.message}`));
      });

      // Enviar datos de entrada al script Python
      pythonProcess.stdin.write(JSON.stringify(respuestas));
      pythonProcess.stdin.end();
    });
  }

  /**
   * Calcula los promedios de cada dimensión a partir de respuestas individuales
   * @param {Object} respuestas - Respuestas individuales (q1, q2, ..., q65)
   * @returns {Object} - Promedios calculados por dimensión
   */
  calcularPromedios(respuestas) {
    const promedios = {
      // RIASEC
      R: this._calcularPromedio(respuestas, [1, 2, 3, 4, 5]),
      I: this._calcularPromedio(respuestas, [6, 7, 8, 9, 10]),
      A: this._calcularPromedio(respuestas, [11, 12, 13, 14, 15]),
      S: this._calcularPromedio(respuestas, [16, 17, 18, 19, 20]),
      E: this._calcularPromedio(respuestas, [21, 22, 23, 24, 25]),
      C: this._calcularPromedio(respuestas, [26, 27, 28, 29, 30]),
      
      // Gardner
      LM: this._calcularPromedio(respuestas, [31, 32, 33, 34]),
      L: this._calcularPromedio(respuestas, [35, 36, 37, 38]),
      ES: this._calcularPromedio(respuestas, [39, 40, 41, 42]),
      M: this._calcularPromedio(respuestas, [43, 44, 45, 46]),
      CK: this._calcularPromedio(respuestas, [47, 48, 49, 50]),
      IP: this._calcularPromedio(respuestas, [51, 52, 53, 54]),
      IA: this._calcularPromedio(respuestas, [55, 56, 57, 58]),
      N: this._calcularPromedio(respuestas, [59, 60, 61, 62]),
      
      // Rendimiento (no se promedian)
      Rendimiento_General: respuestas.q63 || 0,
      Rendimiento_STEM: respuestas.q64 || 0,
      Rendimiento_Humanidades: respuestas.q65 || 0
    };

    return promedios;
  }

  /**
   * Calcula el promedio de un conjunto de preguntas
   * @private
   */
  _calcularPromedio(respuestas, indices) {
    const valores = indices.map(i => respuestas[`q${i}`] || 0);
    const suma = valores.reduce((acc, val) => acc + val, 0);
    return Math.round((suma / valores.length) * 10) / 10; // Redondear a 1 decimal
  }

  /**
   * Valida que las respuestas tengan el formato correcto
   * @param {Object} respuestas - Respuestas del test
   * @returns {Object} - { valid: boolean, error: string }
   */
  validarRespuestas(respuestas) {
    // Si vienen respuestas individuales (q1, q2, ...)
    if (respuestas.q1 !== undefined) {
      for (let i = 1; i <= 65; i++) {
        const valor = respuestas[`q${i}`];
        if (valor === undefined || valor === null) {
          return {
            valid: false,
            error: `Falta la respuesta q${i}`
          };
        }
        if (valor < 1 || valor > 5) {
          return {
            valid: false,
            error: `La respuesta q${i} debe estar entre 1 y 5`
          };
        }
      }
      return { valid: true };
    }

    // Si vienen promedios calculados
    const dimensionesRequeridas = [
      'R', 'I', 'A', 'S', 'E', 'C',
      'LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N',
      'Rendimiento_General', 'Rendimiento_STEM', 'Rendimiento_Humanidades'
    ];

    for (const dimension of dimensionesRequeridas) {
      if (respuestas[dimension] === undefined || respuestas[dimension] === null) {
        return {
          valid: false,
          error: `Falta la dimensión ${dimension}`
        };
      }
    }

    return { valid: true };
  }
}

// Exportar instancia única del servicio
const mlService = new MLService();
export default mlService;

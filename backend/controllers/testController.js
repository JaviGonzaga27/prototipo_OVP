import { TestResult } from '../models/index.js';
import mlService from '../ml/mlService.js';

// @desc    Enviar respuestas y obtener predicción de carrera
// @route   POST /api/test/predict
// @access  Private
export const predictCareer = async (req, res) => {
  try {
    const { answers } = req.body;

    // Validar que existan las respuestas
    if (!answers) {
      return res.status(400).json({
        success: false,
        message: 'Las respuestas son requeridas'
      });
    }

    // Validar formato de respuestas
    const validation = mlService.validarRespuestas(answers);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    console.log('✅ Respuestas validadas, calculando promedios...');
    
    // Calcular promedios si vienen respuestas individuales
    let datosParaPrediccion = answers;
    if (answers.q1 !== undefined) {
      datosParaPrediccion = mlService.calcularPromedios(answers);
      console.log('✅ Promedios calculados:', datosParaPrediccion);
    }
    
    // Realizar predicción
    const prediction = await mlService.predecir(datosParaPrediccion);
    
    console.log('✅ Predicción completada:', prediction.carrera_recomendada);

    // Guardar resultado en la base de datos
    const testResult = await TestResult.create({
      userId: req.user.id,
      answers,
      predictedCareer: prediction.carrera_recomendada,
      confidence: prediction.porcentaje_confianza, // Guardar como porcentaje (0-100)
      topCareers: prediction.top_5_carreras,
      profile: prediction.perfil
    });

    res.status(201).json({
      success: true,
      message: 'Predicción realizada exitosamente',
      prediction: {
        id: testResult.id,
        carrera_recomendada: prediction.carrera_recomendada,
        confianza: prediction.porcentaje_confianza, // porcentaje de 0-100
        top_5_carreras: prediction.top_5_carreras,
        perfil: prediction.perfil,
        completedAt: testResult.completedAt
      }
    });
  } catch (error) {
    console.error('❌ Error en predicción:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al realizar predicción',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Guardar resultados del test (método legacy)
// @route   POST /api/test/results
// @access  Private
export const saveTestResults = async (req, res) => {
  try {
    const { answers, results } = req.body;

    const testResult = await TestResult.create({
      userId: req.user.id,
      answers,
      results
    });

    res.status(201).json({
      success: true,
      testResult
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar resultados',
      error: error.message 
    });
  }
};

// @desc    Obtener resultados del usuario actual
// @route   GET /api/test/my-results
// @access  Private
export const getMyResults = async (req, res) => {
  try {
    const results = await TestResult.findAll({
      where: { userId: req.user.id },
      order: [['completedAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener resultados',
      error: error.message 
    });
  }
};

// @desc    Obtener resultado específico
// @route   GET /api/test/results/:id
// @access  Private
export const getTestResultById = async (req, res) => {
  try {
    const result = await TestResult.findByPk(req.params.id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resultado no encontrado' 
      });
    }

    // Verificar que el resultado pertenezca al usuario o sea admin
    if (result.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'No autorizado para ver este resultado' 
      });
    }

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener resultado',
      error: error.message 
    });
  }
};

import { TestResult } from '../models/index.js';

// @desc    Guardar resultados del test
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

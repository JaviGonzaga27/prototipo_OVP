import { Question } from '../models/index.js';

// @desc    Obtener todas las preguntas activas
// @route   GET /api/questions
// @access  Private
export const getActiveQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener preguntas',
      error: error.message 
    });
  }
};

// @desc    Obtener todas las preguntas (incluyendo inactivas)
// @route   GET /api/questions/all
// @access  Private/Admin
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [['order', 'ASC']]
    });
    
    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener preguntas',
      error: error.message 
    });
  }
};

// @desc    Obtener pregunta por ID
// @route   GET /api/questions/:id
// @access  Private/Admin
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pregunta no encontrada' 
      });
    }

    res.json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener pregunta',
      error: error.message 
    });
  }
};

// @desc    Crear nueva pregunta
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req, res) => {
  try {
    const { text, options, category, order, isActive } = req.body;

    const question = await Question.create({
      text,
      options,
      category,
      order,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear pregunta',
      error: error.message 
    });
  }
};

// @desc    Actualizar pregunta
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res) => {
  try {
    const { text, options, category, order, isActive } = req.body;

    const question = await Question.findByPk(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pregunta no encontrada' 
      });
    }

    question.text = text || question.text;
    question.options = options || question.options;
    question.category = category || question.category;
    question.order = order !== undefined ? order : question.order;
    question.isActive = isActive !== undefined ? isActive : question.isActive;

    await question.save();

    res.json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar pregunta',
      error: error.message 
    });
  }
};

// @desc    Eliminar pregunta
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pregunta no encontrada' 
      });
    }

    await question.destroy();

    res.json({
      success: true,
      message: 'Pregunta eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar pregunta',
      error: error.message 
    });
  }
};

// @desc    Activar/desactivar pregunta
// @route   PATCH /api/questions/:id/toggle
// @access  Private/Admin
export const toggleQuestionStatus = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pregunta no encontrada' 
      });
    }

    question.isActive = !question.isActive;
    await question.save();

    res.json({
      success: true,
      message: `Pregunta ${question.isActive ? 'activada' : 'desactivada'} correctamente`,
      question
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al cambiar estado de pregunta',
      error: error.message 
    });
  }
};

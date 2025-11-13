import { User, TestResult } from '../models/index.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuarios',
      error: error.message 
    });
  }
};

// @desc    Obtener usuario por ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuario',
      error: error.message 
    });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar usuario',
      error: error.message 
    });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // No permitir que el admin se elimine a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'No puedes eliminar tu propia cuenta' 
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar usuario',
      error: error.message 
    });
  }
};

// @desc    Obtener todos los resultados de tests
// @route   GET /api/admin/results
// @access  Private/Admin
export const getAllTestResults = async (req, res) => {
  try {
    const results = await TestResult.findAll({
      include: [{
        model: User,
        attributes: ['name', 'email']
      }],
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

// @desc    Obtener resultados de test de un usuario específico
// @route   GET /api/admin/results/:userId
// @access  Private/Admin
export const getUserTestResults = async (req, res) => {
  try {
    const results = await TestResult.findAll({
      where: { userId: req.params.userId },
      include: [{
        model: User,
        attributes: ['name', 'email']
      }],
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
      message: 'Error al obtener resultados del usuario',
      error: error.message 
    });
  }
};

// @desc    Obtener estadísticas generales
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'student' } });
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    const totalTests = await TestResult.count();
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalTests
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};

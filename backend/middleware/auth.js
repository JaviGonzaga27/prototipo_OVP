import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado - No se encontró token' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }

      // Convertir instancia Sequelize a objeto plano
      req.user = user.get({ plain: true });

      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado - Token inválido' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error en la autenticación' 
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'No autorizado - Se requieren permisos de administrador' 
    });
  }
};

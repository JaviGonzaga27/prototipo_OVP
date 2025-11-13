import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'El email ya está registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe ser un email válido'
      },
      notEmpty: {
        msg: 'El email es requerido'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña es requerida'
      },
      len: {
        args: [6, 255],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
    allowNull: false
  }
}, {
  tableName: 'Users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método de instancia para comparar contraseñas
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// No devolver la contraseña en las respuestas JSON
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;

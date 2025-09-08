const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

// Validaciones para login
const loginValidation = [
  body('correo').isEmail().withMessage('El correo debe ser válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Validaciones para registro
const registerValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('correo').isEmail().withMessage('El correo debe ser válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('permisos').isIn(['FACTURACION', 'ADMINISTRACION']).withMessage('Permisos inválidos')
];

// Login de usuario
const login = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { correo, password } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findByEmail(correo);
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Correo o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Correo o contraseña incorrectos'
      });
    }

    // Generar tokens JWT
    const accessToken = generateAccessToken({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      permisos: usuario.permisos
    });

    const refreshToken = generateRefreshToken({
      id: usuario.id,
      correo: usuario.correo
    });

    // Guardar refresh token en la base de datos
    const RefreshToken = require('../models/refreshToken.model');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
    await RefreshToken.create(usuario.id, refreshToken, expiresAt);

    // Enviar respuesta sin contraseña
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar el login'
    });
  }
};

// Registro de usuario (solo ADMINISTRACIONes)
const register = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { nombre, apellido, correo, password, permisos } = req.body;

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findByEmail(correo);
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Correo duplicado',
        message: 'Ya existe un usuario con ese correo'
      });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      password: hashedPassword,
      permisos
    });

    // Generar token JWT
    const token = generateToken({
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      correo: nuevoUsuario.correo,
      permisos: nuevoUsuario.permisos
    });

    // Enviar respuesta sin contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al registrar el usuario'
    });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Contraseña inválida',
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener usuario actual
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe'
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, usuario.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Contraseña incorrecta',
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    const actualizado = await Usuario.update(userId, {
      ...usuario,
      password: hashedNewPassword
    });

    if (!actualizado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la contraseña'
      });
    }

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al cambiar la contraseña'
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe'
      });
    }

    // Enviar respuesta sin contraseña
    const { password, ...usuarioSinPassword } = usuario;

    res.json(usuarioSinPassword);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el perfil'
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token requerido',
        message: 'El refresh token es obligatorio'
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Verificar que el token existe en la base de datos
    const RefreshToken = require('../models/refreshToken.model');
    const storedToken = await RefreshToken.findByToken(refreshToken);
    
    if (!storedToken) {
      return res.status(401).json({
        error: 'Refresh token inválido',
        message: 'El refresh token no existe o ha expirado'
      });
    }

    // Obtener usuario
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        message: 'El usuario asociado al token no existe'
      });
    }

    // Generar nuevos tokens
    const newAccessToken = generateAccessToken({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      permisos: usuario.permisos
    });

    const newRefreshToken = generateRefreshToken({
      id: usuario.id,
      correo: usuario.correo
    });

    // Eliminar el refresh token anterior
    await RefreshToken.deleteByToken(refreshToken);

    // Guardar el nuevo refresh token
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 días
    await RefreshToken.create(usuario.id, newRefreshToken, expiresAt);

    res.json({
      message: 'Tokens renovados exitosamente',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('Error al renovar tokens:', error);
    
    // Si es un error de duplicado, intentar limpiar y reintentar
    if (error.code === 'ER_DUP_ENTRY') {
      try {
        const RefreshToken = require('../models/refreshToken.model');
        await RefreshToken.cleanExpiredTokens();
        
        return res.status(500).json({
          error: 'Error de concurrencia',
          message: 'Por favor, intenta nuevamente'
        });
      } catch (cleanupError) {
        console.error('Error al limpiar tokens:', cleanupError);
      }
    }
    
    res.status(401).json({
      error: 'Error al renovar tokens',
      message: 'El refresh token es inválido o ha expirado'
    });
  }
};

// Logout (revocar refresh token)
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const RefreshToken = require('../models/refreshToken.model');
      await RefreshToken.deleteByToken(refreshToken);
    }

    res.json({
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al realizar logout'
    });
  }
};

module.exports = {
  login,
  register,
  changePassword,
  getProfile,
  refreshToken,
  logout,
  loginValidation,
  registerValidation
}; 
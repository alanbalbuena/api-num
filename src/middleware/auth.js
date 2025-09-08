const { verifyAccessToken, extractToken } = require('../config/jwt');

// Middleware para verificar autenticación
const authenticateToken = (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Token de acceso requerido'
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token inválido',
      message: 'El token de acceso no es válido o ha expirado'
    });
  }
};

// Middleware para verificar roles específicos
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Autenticación requerida'
      });
    }

    if (!roles.includes(req.user.permisos)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

// Middleware para verificar si es el propio usuario o admin
const authorizeUserOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id);
  
  if (req.user.permisos === 'ADMINISTRACION' || req.user.id === userId) {
    return next();
  }

  return res.status(403).json({
    error: 'Acceso denegado',
    message: 'Solo puedes acceder a tu propia información'
  });
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeUserOrAdmin
}; 
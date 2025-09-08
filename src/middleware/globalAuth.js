const { authenticateToken } = require('./auth');

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register'
];

// Middleware de autenticación global
const globalAuth = (req, res, next) => {
  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(route => 
    req.path.startsWith(route)
  );

  // Si es una ruta pública, continuar sin autenticación
  if (isPublicRoute) {
    return next();
  }

  // Si no es una ruta pública, aplicar autenticación
  return authenticateToken(req, res, next);
};

module.exports = globalAuth; 
const crypto = require('crypto');

// Generar un token único para refresh tokens
const generateUniqueToken = () => {
  // Usar crypto.randomBytes para generar un token único
  const randomBytes = crypto.randomBytes(32);
  return randomBytes.toString('hex');
};

// Generar un token con timestamp para evitar duplicados
const generateTimestampedToken = (userId) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  return `${userId}_${timestamp}_${random}`;
};

module.exports = {
  generateUniqueToken,
  generateTimestampedToken
}; 
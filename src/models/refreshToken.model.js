const db = require('../config/database');

class RefreshToken {
  // Crear un refresh token
  static async create(userId, token, expiresAt) {
    try {
      const [result] = await db.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
      );
      return { id: result.insertId, userId, token, expiresAt };
    } catch (error) {
      throw error;
    }
  }

  // Crear un refresh token con conexión específica (para transacciones)
  static async createWithConnection(connection, userId, token, expiresAt) {
    try {
      const [result] = await connection.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)',
        [userId, token, expiresAt]
      );
      return { id: result.insertId, userId, token, expiresAt };
    } catch (error) {
      throw error;
    }
  }

  // Buscar un refresh token por token
  static async findByToken(token) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
        [token]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un refresh token
  static async deleteByToken(token) {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [token]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un refresh token con conexión específica (para transacciones)
  static async deleteByTokenWithConnection(connection, token) {
    try {
      const [result] = await connection.query(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [token]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar todos los refresh tokens de un usuario
  static async deleteByUserId(userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE user_id = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Limpiar tokens expirados
  static async cleanExpiredTokens() {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE expires_at < NOW()'
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RefreshToken; 
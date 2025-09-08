const db = require('../config/database');

class Vacaciones {
  // Obtener todo el historial de vacaciones
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM vista_historial_vacaciones ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener historial de vacaciones por ID de usuario
  static async findByUsuarioId(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM vista_historial_vacaciones WHERE usuario_id = ? ORDER BY id DESC',
        [id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vacaciones; 
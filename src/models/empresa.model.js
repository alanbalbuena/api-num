const db = require('../config/database');

class Empresa {
  // Obtener todas las empresas (con búsqueda por query param)
  static async findAll(search) {
    try {
      let query = 'SELECT * FROM empresa';
      let params = [];
      if (search) {
        query += ' WHERE nombre LIKE ?';
        params.push(`${search.toUpperCase()}%`);
      }
      query += ' ORDER BY id DESC';
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una empresa por ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM empresa WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener una empresa por RFC
  static async findByRfc(rfc) {
    try {
      const [rows] = await db.query('SELECT * FROM empresa WHERE rfc = ?', [rfc]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva empresa
  static async create(empresaData) {
    const { nombre, rfc, giro, destino } = empresaData;
    
    try {
      const [result] = await db.query(
        'INSERT INTO empresa (nombre, rfc, giro, destino) VALUES (?, ?, ?, ?)',
        [nombre, rfc, giro, destino]
      );
      return { id: result.insertId, ...empresaData };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una empresa
  static async update(id, empresaData) {
    const { nombre, rfc, giro, destino } = empresaData;
    
    try {
      const [result] = await db.query(
        'UPDATE empresa SET nombre = ?, rfc = ?, giro = ?, destino = ? WHERE id = ?',
        [nombre, rfc, giro, destino, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una empresa
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM empresa WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Empresa; 
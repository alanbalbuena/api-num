const db = require('../config/database');

class Broker {
  // Obtener todos los brokers
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM broker ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un broker por ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM broker WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo broker
  static async create(brokerData) {
    const { nombre } = brokerData;
    
    try {
      const [result] = await db.query(
        'INSERT INTO broker (nombre) VALUES (?)',
        [nombre]
      );
      return { id: result.insertId, nombre };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un broker
  static async update(id, brokerData) {
    const { nombre } = brokerData;
    
    try {
      const [result] = await db.query(
        'UPDATE broker SET nombre = ? WHERE id = ?',
        [nombre, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un broker
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM broker WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Buscar brokers por nombre (búsqueda parcial)
  static async searchByName(searchTerm) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM broker WHERE nombre LIKE ? ORDER BY id DESC',
        [`%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar brokers que empiecen con una letra específica
  static async findByLetter(letter) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM broker WHERE nombre LIKE ? ORDER BY id DESC',
        [`${letter.toUpperCase()}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar métodos relacionados con porcentaje
}

module.exports = Broker; 
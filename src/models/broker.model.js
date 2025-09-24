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

  // Obtener todos los brokers con su saldo (suma de comisiones pendientes)
  static async findAllWithSaldo() {
    try {
      const [rows] = await db.query(`
        SELECT 
          b.*,
          COALESCE(SUM(cb.comision), 0) as saldo_pendiente
        FROM broker b
        LEFT JOIN comision_broker cb ON b.id = cb.id_broker AND cb.estatus = 'PENDIENTE'
        GROUP BY b.id
        ORDER BY b.id DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un broker por ID con su saldo
  static async findByIdWithSaldo(id) {
    try {
      const [rows] = await db.query(`
        SELECT 
          b.*,
          COALESCE(SUM(cb.comision), 0) as saldo_pendiente
        FROM broker b
        LEFT JOIN comision_broker cb ON b.id = cb.id_broker AND cb.estatus = 'PENDIENTE'
        WHERE b.id = ?
        GROUP BY b.id
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar brokers por nombre con saldo
  static async searchByNameWithSaldo(searchTerm) {
    try {
      const [rows] = await db.query(`
        SELECT 
          b.*,
          COALESCE(SUM(cb.comision), 0) as saldo_pendiente
        FROM broker b
        LEFT JOIN comision_broker cb ON b.id = cb.id_broker AND cb.estatus = 'PENDIENTE'
        WHERE b.nombre LIKE ?
        GROUP BY b.id
        ORDER BY b.id DESC
      `, [`%${searchTerm}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar brokers por letra con saldo
  static async findByLetterWithSaldo(letter) {
    try {
      const [rows] = await db.query(`
        SELECT 
          b.*,
          COALESCE(SUM(cb.comision), 0) as saldo_pendiente
        FROM broker b
        LEFT JOIN comision_broker cb ON b.id = cb.id_broker AND cb.estatus = 'PENDIENTE'
        WHERE b.nombre LIKE ?
        GROUP BY b.id
        ORDER BY b.id DESC
      `, [`${letter.toUpperCase()}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Broker; 
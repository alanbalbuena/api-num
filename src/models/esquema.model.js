const db = require('../config/database');

class Esquema {
  // Obtener todos los esquemas
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM esquema ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un esquema por ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM esquema WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo esquema
  static async create(esquemaData) {
    const { 
      id_razon_social,
      tipo_esquema, 
      porcentaje_esquema,
      costo,
      id_broker1, 
      porcentaje_broker1,
      id_broker2, 
      porcentaje_broker2,
      id_broker3, 
      porcentaje_broker3
    } = esquemaData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO esquema (
          id_razon_social,
          tipo_esquema, 
          porcentaje_esquema,
          costo,
          id_broker1, 
          porcentaje_broker1,
          id_broker2, 
          porcentaje_broker2,
          id_broker3, 
          porcentaje_broker3
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_razon_social,
          tipo_esquema, 
          porcentaje_esquema,
          costo,
          id_broker1, 
          porcentaje_broker1,
          id_broker2, 
          porcentaje_broker2,
          id_broker3, 
          porcentaje_broker3
        ]
      );
      return { id: result.insertId, ...esquemaData };
    } catch (error) {
      throw error;
    }
  }

  // Buscar esquema por razón social y tipo
  static async findByRazonSocialAndType(id_razon_social, tipo_esquema) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM esquema WHERE id_razon_social = ? AND tipo_esquema = ?',
        [id_razon_social, tipo_esquema]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar esquema por cliente y tipo
  static async findByClienteAndType(id_cliente, tipo_esquema) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM esquema WHERE id_cliente = ? AND tipo_esquema = ?',
        [id_cliente, tipo_esquema]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener esquemas por cliente
  static async findByClienteId(clienteId) {
    try {
      const [rows] = await db.query('SELECT * FROM esquema WHERE id_cliente = ? ORDER BY id DESC', [clienteId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener esquemas por razón social
  static async findByRazonSocialId(razonSocialId) {
    try {
      const [rows] = await db.query('SELECT * FROM esquema WHERE id_razon_social = ? ORDER BY id DESC', [razonSocialId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un esquema
  static async update(id, esquemaData) {
    const { 
      id_razon_social,
      tipo_esquema, 
      porcentaje_esquema,
      costo,
      id_broker1, 
      porcentaje_broker1,
      id_broker2, 
      porcentaje_broker2,
      id_broker3, 
      porcentaje_broker3
    } = esquemaData;
    
    try {
      const [result] = await db.query(
        `UPDATE esquema SET 
          id_razon_social = ?,
          tipo_esquema = ?, 
          porcentaje_esquema = ?,
          costo = ?,
          id_broker1 = ?, 
          porcentaje_broker1 = ?,
          id_broker2 = ?, 
          porcentaje_broker2 = ?,
          id_broker3 = ?, 
          porcentaje_broker3 = ?
          WHERE id = ?`,
        [
          id_razon_social,
          tipo_esquema, 
          porcentaje_esquema,
          costo,
          id_broker1, 
          porcentaje_broker1,
          id_broker2, 
          porcentaje_broker2,
          id_broker3, 
          porcentaje_broker3,
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar esquemas por cliente
  static async deleteByCliente(id_cliente) {
    try {
      const [result] = await db.query('DELETE FROM esquema WHERE id_cliente = ?', [id_cliente]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un esquema por ID
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM esquema WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Esquema; 
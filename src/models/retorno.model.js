const db = require('../config/database');

class Retorno {
  // Obtener todos los retornos
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT r.*, 
               o.tipo_esquema,
               o.deposito as deposito_operacion
        FROM retornos r
        LEFT JOIN operaciones o ON r.id_operacion = o.id
        ORDER BY r.fecha_creacion DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un retorno por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT r.*, 
               o.tipo_esquema,
               o.deposito as deposito_operacion
        FROM retornos r
        LEFT JOIN operaciones o ON r.id_operacion = o.id
        WHERE r.id_retorno = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener retornos por operación
  static async findByOperacion(idOperacion) {
    try {
      const [rows] = await db.query(`
        SELECT r.*, 
               o.tipo_esquema,
               o.deposito as deposito_operacion
        FROM retornos r
        LEFT JOIN operaciones o ON r.id_operacion = o.id
        WHERE r.id_operacion = ?
        ORDER BY r.fecha_pago DESC
      `, [idOperacion]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo retorno
  static async create(retornoData) {
    const {
      id_operacion,
      fecha_pago,
      monto_pagado,
      metodo_pago,
      referencia,
      comprobante_pago
    } = retornoData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO retornos (
          id_operacion,
          fecha_pago,
          monto_pagado,
          metodo_pago,
          referencia,
          comprobante_pago
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [id_operacion, fecha_pago, monto_pagado, metodo_pago, referencia, comprobante_pago]
      );
      
      return { id_retorno: result.insertId, ...retornoData };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un retorno
  static async update(id, retornoData) {
    const {
      id_operacion,
      fecha_pago,
      monto_pagado,
      metodo_pago,
      referencia,
      comprobante_pago
    } = retornoData;
    try {
      const [result] = await db.query(
        `UPDATE retornos SET 
          id_operacion = ?,
          fecha_pago = ?,
          monto_pagado = ?,
          metodo_pago = ?,
          referencia = ?,
          comprobante_pago = ?
          WHERE id_retorno = ?`,
        [id_operacion, fecha_pago, monto_pagado, metodo_pago, referencia, comprobante_pago, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un retorno
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM retornos WHERE id_retorno = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas de retornos por operación
  static async getEstadisticasByOperacion(idOperacion) {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_retornos,
          SUM(monto_pagado) as total_pagado,
          AVG(monto_pagado) as promedio_pagado,
          MIN(fecha_pago) as primera_fecha_pago,
          MAX(fecha_pago) as ultima_fecha_pago
        FROM retornos 
        WHERE id_operacion = ?
      `, [idOperacion]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener retornos por rango de fechas
  static async findByDateRange(fechaInicio, fechaFin) {
    try {
      const [rows] = await db.query(`
        SELECT r.*, 
               o.tipo_esquema,
               o.deposito as deposito_operacion
        FROM retornos r
        LEFT JOIN operaciones o ON r.id_operacion = o.id
        WHERE r.fecha_pago BETWEEN ? AND ?
        ORDER BY r.fecha_pago DESC
      `, [fechaInicio, fechaFin]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Retorno;
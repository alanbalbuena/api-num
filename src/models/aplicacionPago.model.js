const db = require('../config/database');

class AplicacionPago {
  // Obtener todas las aplicaciones de pago
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT ap.*, 
               o.numero_operacion,
               o.tipo_esquema,
               o.deposito as deposito_operacion,
               mb.fecha as fecha_movimiento,
               mb.ingreso as monto_movimiento,
               mb.descripcion as concepto_movimiento
        FROM aplicacion_pagos ap
        LEFT JOIN operaciones o ON ap.id_operacion = o.id
        LEFT JOIN movimientos_bancarios mb ON ap.id_deposito = mb.id
        ORDER BY ap.fecha_aplicacion DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una aplicación de pago por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT ap.*, 
               o.numero_operacion,
               o.tipo_esquema,
               o.deposito as deposito_operacion,
               mb.fecha as fecha_movimiento,
               mb.ingreso as monto_movimiento,
               mb.descripcion as concepto_movimiento
        FROM aplicacion_pagos ap
        LEFT JOIN operaciones o ON ap.id_operacion = o.id
        LEFT JOIN movimientos_bancarios mb ON ap.id_deposito = mb.id
        WHERE ap.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener aplicaciones de pago por operación
  static async findByOperacion(idOperacion) {
    try {
      const [rows] = await db.query(`
        SELECT ap.*, 
               o.numero_operacion,
               o.tipo_esquema,
               o.deposito as deposito_operacion,
               mb.fecha as fecha_movimiento,
               mb.ingreso as monto_movimiento,
               mb.descripcion as concepto_movimiento
        FROM aplicacion_pagos ap
        LEFT JOIN operaciones o ON ap.id_operacion = o.id
        LEFT JOIN movimientos_bancarios mb ON ap.id_deposito = mb.id
        WHERE ap.id_operacion = ?
        ORDER BY ap.fecha_aplicacion DESC
      `, [idOperacion]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener aplicaciones de pago por movimiento bancario
  static async findByMovimientoBancario(idMovimiento) {
    try {
      const [rows] = await db.query(`
        SELECT ap.*, 
               o.numero_operacion,
               o.tipo_esquema,
               o.deposito as deposito_operacion,
               mb.fecha as fecha_movimiento,
               mb.ingreso as monto_movimiento,
               mb.descripcion as concepto_movimiento
        FROM aplicacion_pagos ap
        LEFT JOIN operaciones o ON ap.id_operacion = o.id
        LEFT JOIN movimientos_bancarios mb ON ap.id_deposito = mb.id
        WHERE ap.id_deposito = ?
        ORDER BY ap.fecha_aplicacion DESC
      `, [idMovimiento]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva aplicación de pago
  static async create(aplicacionData) {
    const {
      id_operacion,
      id_deposito,
      monto_aplicado
    } = aplicacionData;
    try {
      const [result] = await db.query(
        `INSERT INTO aplicacion_pagos (
          id_operacion,
          id_deposito,
          monto_aplicado
        ) VALUES (?, ?, ?)`,
        [id_operacion, id_deposito, monto_aplicado]
      );
      return { id: result.insertId, ...aplicacionData };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una aplicación de pago
  static async update(id, aplicacionData) {
    const {
      id_operacion,
      id_deposito,
      monto_aplicado
    } = aplicacionData;
    try {
      const [result] = await db.query(
        `UPDATE aplicacion_pagos SET 
          id_operacion = ?,
          id_deposito = ?,
          monto_aplicado = ?
          WHERE id = ?`,
        [id_operacion, id_deposito, monto_aplicado, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una aplicación de pago
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM aplicacion_pagos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas de aplicaciones por operación
  static async getEstadisticasByOperacion(idOperacion) {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_aplicaciones,
          SUM(monto_aplicado) as total_aplicado,
          AVG(monto_aplicado) as promedio_aplicado,
          MIN(fecha_aplicacion) as primera_aplicacion,
          MAX(fecha_aplicacion) as ultima_aplicacion
        FROM aplicacion_pagos 
        WHERE id_operacion = ?
      `, [idOperacion]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener aplicaciones por rango de fechas
  static async findByDateRange(fechaInicio, fechaFin) {
    try {
      const [rows] = await db.query(`
        SELECT ap.*, 
               o.numero_operacion,
               o.tipo_esquema,
               o.deposito as deposito_operacion,
               mb.fecha as fecha_movimiento,
               mb.ingreso as monto_movimiento,
               mb.descripcion as concepto_movimiento
        FROM aplicacion_pagos ap
        LEFT JOIN operaciones o ON ap.id_operacion = o.id
        LEFT JOIN movimientos_bancarios mb ON ap.id_deposito = mb.id
        WHERE ap.fecha_aplicacion BETWEEN ? AND ?
        ORDER BY ap.fecha_aplicacion DESC
      `, [fechaInicio, fechaFin]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Verificar si un movimiento bancario ya tiene aplicaciones
  static async checkMovimientoAplicado(idMovimiento) {
    try {
      const [rows] = await db.query(`
        SELECT COUNT(*) as total_aplicaciones,
               SUM(monto_aplicado) as total_aplicado
        FROM aplicacion_pagos 
        WHERE id_deposito = ?
      `, [idMovimiento]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AplicacionPago; 
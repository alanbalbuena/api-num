const db = require('../config/database');

class ComisionBroker {
  // Obtener todas las comisiones de broker
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT * FROM comision_broker
        ORDER BY id DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una comisión por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM comision_broker
        WHERE id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener comisiones por broker
  static async findByBroker(idBroker) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM comision_broker
        WHERE id_broker = ?
        ORDER BY id DESC
      `, [idBroker]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener comisiones por operación
  static async findByOperacion(idOperacion) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM comision_broker
        WHERE id_operacion = ?
        ORDER BY id ASC
      `, [idOperacion]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva comisión de broker
  static async create(comisionData) {
    const {
      id_broker,
      id_operacion,
      comision,
      estatus,
      metodo_pago,
      fecha_pago
    } = comisionData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO comision_broker (
          id_broker,
          id_operacion,
          comision,
          estatus,
          metodo_pago,
          fecha_pago
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id_broker,
          id_operacion,
          comision,
          estatus || 'PENDIENTE',
          metodo_pago || null,
          fecha_pago
        ]
      );
      
      // Obtener la comisión creada
      const comisionCreada = await this.findById(result.insertId);
      return comisionCreada;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una comisión de broker
  static async update(id, comisionData) {
    try {
      // Construir la consulta SQL dinámicamente solo con los campos que se envían
      const camposAActualizar = [];
      const valores = [];
      
      // Solo incluir campos que están definidos (no undefined)
      if (comisionData.id_broker !== undefined) {
        camposAActualizar.push('id_broker = ?');
        valores.push(comisionData.id_broker);
      }
      
      if (comisionData.id_operacion !== undefined) {
        camposAActualizar.push('id_operacion = ?');
        valores.push(comisionData.id_operacion);
      }
      
      if (comisionData.comision !== undefined) {
        camposAActualizar.push('comision = ?');
        valores.push(comisionData.comision);
      }
      
      if (comisionData.estatus !== undefined) {
        camposAActualizar.push('estatus = ?');
        valores.push(comisionData.estatus);
      }
      
      if (comisionData.metodo_pago !== undefined) {
        camposAActualizar.push('metodo_pago = ?');
        valores.push(comisionData.metodo_pago);
      }
      
      if (comisionData.fecha_pago !== undefined) {
        camposAActualizar.push('fecha_pago = ?');
        valores.push(comisionData.fecha_pago);
      }
      
      // Si no hay campos para actualizar, retornar false
      if (camposAActualizar.length === 0) {
        return false;
      }
      
      // Construir la consulta SQL dinámicamente
      const query = `UPDATE comision_broker SET ${camposAActualizar.join(', ')} WHERE id = ?`;
      valores.push(id);
      
      const [result] = await db.query(query, valores);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una comisión de broker
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM comision_broker WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar todas las comisiones de una operación
  static async deleteByOperacion(idOperacion) {
    try {
      const [result] = await db.query('DELETE FROM comision_broker WHERE id_operacion = ?', [idOperacion]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener comisiones por estatus
  static async findByEstatus(estatus) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM comision_broker
        WHERE estatus = ?
        ORDER BY id DESC
      `, [estatus]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener comisiones pendientes
  static async findPendientes() {
    return this.findByEstatus('PENDIENTE');
  }

  // Obtener comisiones pagadas
  static async findPagadas() {
    return this.findByEstatus('PAGADA');
  }

  // Obtener comisiones canceladas
  static async findCanceladas() {
    return this.findByEstatus('CANCELADA');
  }

  // Obtener estadísticas de comisiones por broker
  static async getEstadisticasPorBroker(idBroker) {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_comisiones,
          SUM(CASE WHEN estatus = 'PENDIENTE' THEN 1 ELSE 0 END) as comisiones_pendientes,
          SUM(CASE WHEN estatus = 'PAGADA' THEN 1 ELSE 0 END) as comisiones_pagadas,
          SUM(CASE WHEN estatus = 'CANCELADA' THEN 1 ELSE 0 END) as comisiones_canceladas,
          SUM(comision) as total_comision,
          SUM(CASE WHEN estatus = 'PAGADA' THEN comision ELSE 0 END) as total_pagado,
          SUM(CASE WHEN estatus = 'PENDIENTE' THEN comision ELSE 0 END) as total_pendiente
        FROM comision_broker
        WHERE id_broker = ?
      `, [idBroker]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas generales de comisiones
  static async getEstadisticasGenerales() {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_comisiones,
          COUNT(DISTINCT id_broker) as total_brokers,
          COUNT(DISTINCT id_operacion) as total_operaciones,
          SUM(CASE WHEN estatus = 'PENDIENTE' THEN 1 ELSE 0 END) as comisiones_pendientes,
          SUM(CASE WHEN estatus = 'PAGADA' THEN 1 ELSE 0 END) as comisiones_pagadas,
          SUM(CASE WHEN estatus = 'CANCELADA' THEN 1 ELSE 0 END) as comisiones_canceladas,
          SUM(comision) as total_comision,
          SUM(CASE WHEN estatus = 'PAGADA' THEN comision ELSE 0 END) as total_pagado,
          SUM(CASE WHEN estatus = 'PENDIENTE' THEN comision ELSE 0 END) as total_pendiente,
          AVG(comision) as promedio_comision
        FROM comision_broker
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas de comisiones por período
  static async getStatsByPeriod(fecha_desde, fecha_hasta, id_broker = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_comisiones,
          COUNT(DISTINCT id_broker) as total_brokers,
          COUNT(DISTINCT id_operacion) as total_operaciones,
          SUM(CASE WHEN estatus = 'PENDIENTE' THEN 1 ELSE 0 END) as comisiones_pendientes,
          SUM(CASE WHEN estatus = 'PAGADA' THEN 1 ELSE 0 END) as comisiones_pagadas,
          SUM(CASE WHEN estatus = 'CANCELADA' THEN 1 ELSE 0 END) as comisiones_canceladas,
          SUM(comision) as total_comision,
          SUM(CASE WHEN estatus = 'PAGADA' THEN comision ELSE 0 END) as total_pagado,
          SUM(CASE WHEN estatus = 'PENDIENTE' THEN comision ELSE 0 END) as total_pendiente,
          SUM(CASE WHEN estatus = 'CANCELADA' THEN comision ELSE 0 END) as total_cancelado,
          AVG(comision) as promedio_comision,
          MIN(created_at) as fecha_primera,
          MAX(created_at) as fecha_ultima
        FROM comision_broker
        WHERE created_at BETWEEN ? AND ?
      `;
      
      const params = [fecha_desde, fecha_hasta];
      
      if (id_broker) {
        query += ` AND id_broker = ?`;
        params.push(id_broker);
      }

      const [rows] = await db.query(query, params);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener resumen de comisiones por broker
  static async getResumenPorBroker(fecha_desde = null, fecha_hasta = null) {
    try {
      let query = `
        SELECT 
          b.id,
          b.nombre as broker_nombre,
          COUNT(cb.id) as total_comisiones,
          SUM(cb.comision) as monto_total,
          COUNT(CASE WHEN cb.estatus = 'PAGADA' THEN 1 END) as comisiones_pagadas,
          COUNT(CASE WHEN cb.estatus = 'PENDIENTE' THEN 1 END) as comisiones_pendientes,
          COUNT(CASE WHEN cb.estatus = 'CANCELADA' THEN 1 END) as comisiones_canceladas,
          SUM(CASE WHEN cb.estatus = 'PAGADA' THEN cb.comision ELSE 0 END) as monto_pagado,
          SUM(CASE WHEN cb.estatus = 'PENDIENTE' THEN cb.comision ELSE 0 END) as monto_pendiente,
          AVG(cb.comision) as promedio_comision
        FROM broker b
        LEFT JOIN comision_broker cb ON b.id = cb.id_broker
        WHERE 1=1
      `;
      
      const params = [];

      if (fecha_desde) {
        query += ` AND cb.created_at >= ?`;
        params.push(fecha_desde);
      }

      if (fecha_hasta) {
        query += ` AND cb.created_at <= ?`;
        params.push(fecha_hasta);
      }

      query += ` GROUP BY b.id, b.nombre ORDER BY monto_total DESC`;

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener comisiones por estatus con filtros
  static async findByEstatusWithFilters(estatus, filters = {}) {
    try {
      let query = `
        SELECT cb.*, b.nombre as broker_nombre, o.numero_operacion
        FROM comision_broker cb
        LEFT JOIN broker b ON cb.id_broker = b.id
        LEFT JOIN operaciones o ON cb.id_operacion = o.id
        WHERE cb.estatus = ?
      `;
      
      const params = [estatus];

      // Aplicar filtros adicionales
      if (filters.id_broker) {
        query += ` AND cb.id_broker = ?`;
        params.push(filters.id_broker);
      }

      if (filters.fecha_desde) {
        query += ` AND cb.created_at >= ?`;
        params.push(filters.fecha_desde);
      }

      if (filters.fecha_hasta) {
        query += ` AND cb.created_at <= ?`;
        params.push(filters.fecha_hasta);
      }

      if (filters.metodo_pago) {
        query += ` AND cb.metodo_pago = ?`;
        params.push(filters.metodo_pago);
      }

      query += ` ORDER BY cb.created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT ?`;
        params.push(filters.limit);
        
        if (filters.offset) {
          query += ` OFFSET ?`;
          params.push(filters.offset);
        }
      }

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener comisiones pendientes de pago
  static async findPendientesDePago(fecha_desde = null, fecha_hasta = null) {
    try {
      let query = `
        SELECT cb.*, b.nombre as broker_nombre, o.numero_operacion
        FROM comision_broker cb
        LEFT JOIN broker b ON cb.id_broker = b.id
        LEFT JOIN operaciones o ON cb.id_operacion = o.id
        WHERE cb.estatus = 'PENDIENTE'
      `;
      
      const params = [];

      if (fecha_desde) {
        query += ` AND cb.created_at >= ?`;
        params.push(fecha_desde);
      }

      if (fecha_hasta) {
        query += ` AND cb.created_at <= ?`;
        params.push(fecha_hasta);
      }

      query += ` ORDER BY cb.created_at ASC`;

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ComisionBroker;

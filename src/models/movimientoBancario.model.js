const db = require('../config/database');

class MovimientoBancario {
  // Obtener todos los movimientos (con filtros opcionales)
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM view_movimientos_completos';
      let params = [];
      let conditions = [];
      
      // Filtros opcionales
      if (filters.id_banco) {
        conditions.push('id_banco = ?');
        params.push(filters.id_banco);
      }
      
      if (filters.fecha_desde) {
        conditions.push('fecha >= ?');
        params.push(filters.fecha_desde);
      }
      
      if (filters.fecha_hasta) {
        conditions.push('fecha <= ?');
        params.push(filters.fecha_hasta);
      }
      
      if (filters.id_usuario) {
        conditions.push('id_usuario = ?');
        params.push(filters.id_usuario);
      }
      
      if (filters.tipo) {
        if (filters.tipo === 'ingreso') {
          conditions.push('ingreso > 0');
        } else if (filters.tipo === 'egreso') {
          conditions.push('egreso > 0');
        }
      }
      
      if (filters.search) {
        conditions.push('(descripcion LIKE ? OR referencia LIKE ? OR comentarios LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY fecha DESC, id DESC';
      
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por banco
  static async findByBanco(bancoId, filters = {}) {
    try {
      const allFilters = { ...filters, id_banco: bancoId };
      return await this.findAll(allFilters);
    } catch (error) {
      throw error;
    }
  }

  // Obtener un movimiento por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por fecha
  static async findByFecha(fecha) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE fecha = ? ORDER BY id DESC',
        [fecha]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por rango de fechas
  static async findByRangoFechas(fechaDesde, fechaHasta) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC, id DESC',
        [fechaDesde, fechaHasta]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por usuario
  static async findByUsuario(usuarioId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE id_usuario = ? ORDER BY fecha DESC, id DESC',
        [usuarioId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo movimiento
  static async create(movimientoData) {
    const { 
      id_banco, 
      egreso, 
      ingreso, 
      fecha, 
      descripcion, 
      referencia, 
      comentarios, 
      id_factura, 
      id_usuario 
    } = movimientoData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO movimientos_bancarios (
          id_banco, 
          egreso, 
          ingreso, 
          fecha, 
          descripcion, 
          referencia, 
          comentarios, 
          id_factura, 
          id_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_banco, egreso || 0, ingreso || 0, fecha, descripcion, referencia, comentarios, id_factura, id_usuario]
      );
      
      return { id: result.insertId, ...movimientoData };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un movimiento
  static async update(id, movimientoData) {
    const { 
      id_banco, 
      egreso, 
      ingreso, 
      fecha, 
      descripcion, 
      referencia, 
      comentarios, 
      id_factura, 
      id_usuario 
    } = movimientoData;
    
    try {
      const [result] = await db.query(
        `UPDATE movimientos_bancarios SET 
          id_banco = ?, 
          egreso = ?, 
          ingreso = ?, 
          fecha = ?, 
          descripcion = ?, 
          referencia = ?, 
          comentarios = ?, 
          id_factura = ?, 
          id_usuario = ?
        WHERE id = ?`,
        [id_banco, egreso || 0, ingreso || 0, fecha, descripcion, referencia, comentarios, id_factura, id_usuario, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un movimiento
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM movimientos_bancarios WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas de movimientos
  static async getStats(filters = {}) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_movimientos,
          SUM(ingreso) as total_ingresos,
          SUM(egreso) as total_egresos,
          (SUM(ingreso) - SUM(egreso)) as balance_neto,
          COUNT(DISTINCT id_banco) as total_bancos,
          COUNT(DISTINCT id_usuario) as total_usuarios
        FROM movimientos_bancarios
      `;
      let params = [];
      let conditions = [];
      
      // Aplicar filtros
      if (filters.id_banco) {
        conditions.push('id_banco = ?');
        params.push(filters.id_banco);
      }
      
      if (filters.fecha_desde) {
        conditions.push('fecha >= ?');
        params.push(filters.fecha_desde);
      }
      
      if (filters.fecha_hasta) {
        conditions.push('fecha <= ?');
        params.push(filters.fecha_hasta);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const [rows] = await db.query(query, params);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener resumen de movimientos por banco
  static async getResumenPorBanco() {
    try {
      const [rows] = await db.query('SELECT * FROM view_resumen_movimientos_banco ORDER BY saldo_actual DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por factura
  static async findByFactura(facturaId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE id_factura = ? ORDER BY fecha DESC',
        [facturaId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar movimientos por descripción
  static async searchByDescripcion(descripcion) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE descripcion LIKE ? ORDER BY fecha DESC, id DESC',
        [`%${descripcion}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos del día
  static async getMovimientosHoy() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE fecha = CURDATE() ORDER BY id DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos del mes actual
  static async getMovimientosMesActual() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_movimientos_completos WHERE YEAR(fecha) = YEAR(CURDATE()) AND MONTH(fecha) = MONTH(CURDATE()) ORDER BY fecha DESC, id DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener movimientos por empresa
  static async findByEmpresa(empresaId, filters = {}) {
    try {
      let query = `
        SELECT mb.*, b.nombre_banco, b.numero_cuenta, b.clabe_interbancaria, 
               e.nombre as empresa_nombre, e.rfc as empresa_rfc,
               u.nombre as usuario_nombre, u.apellido as usuario_apellido
        FROM movimientos_bancarios mb
        INNER JOIN bancos b ON mb.id_banco = b.id
        INNER JOIN empresa e ON b.id_empresa = e.id
        LEFT JOIN usuario u ON mb.id_usuario = u.id
        WHERE b.id_empresa = ?
      `;
      let params = [empresaId];
      let conditions = [];
      
      // Filtros opcionales
      if (filters.fecha_desde) {
        conditions.push('mb.fecha >= ?');
        params.push(filters.fecha_desde);
      }
      
      if (filters.fecha_hasta) {
        conditions.push('mb.fecha <= ?');
        params.push(filters.fecha_hasta);
      }
      
      if (filters.tipo) {
        if (filters.tipo === 'ingreso') {
          conditions.push('mb.ingreso > 0');
        } else if (filters.tipo === 'egreso') {
          conditions.push('mb.egreso > 0');
        }
      }
      
      if (filters.search) {
        conditions.push('(mb.descripcion LIKE ? OR mb.referencia LIKE ? OR mb.comentarios LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY mb.fecha DESC, mb.id DESC';
      
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Match automático entre movimientos bancarios y operaciones
  static async findAutoMatch(filters = {}) {
    try {
      const query = `
        SELECT 
          mb.id as movimiento_id,
          mb.fecha as movimiento_fecha,
          mb.ingreso as movimiento_ingreso,
          mb.egreso as movimiento_egreso,
          mb.descripcion as movimiento_descripcion,
          mb.referencia as movimiento_referencia,
          b.nombre_banco,
          b.numero_cuenta,
          e_banco.nombre as empresa_banco_nombre,
          e_banco.id as empresa_banco_id,
          
          o.id as operacion_id,
          o.numero_operacion,
          o.deposito as operacion_deposito,
          o.saldo as operacion_saldo,
          o.fecha_operacion,
          o.folio_factura,
          o.tipo_esquema,
          c.nombre as cliente_nombre,
          e_operacion.nombre as empresa_operacion_nombre,
          e_operacion.id as empresa_operacion_id,
          
          ABS(COALESCE(mb.ingreso, 0) - o.deposito) as diferencia_monto,
          DATEDIFF(mb.fecha, o.fecha_operacion) as diferencia_dias,
          
          CASE 
            WHEN ABS(COALESCE(mb.ingreso, 0) - o.deposito) <= 1 
              AND ABS(DATEDIFF(mb.fecha, o.fecha_operacion)) <= 2 
              AND e_banco.id = e_operacion.id
            THEN 'MATCH_PERFECTO'
            WHEN ABS(COALESCE(mb.ingreso, 0) - o.deposito) <= 1 
              AND ABS(DATEDIFF(mb.fecha, o.fecha_operacion)) <= 2
            THEN 'MATCH_SIN_EMPRESA'
            WHEN ABS(COALESCE(mb.ingreso, 0) - o.deposito) <= 1
            THEN 'MATCH_SOLO_MONTO'
            WHEN ABS(DATEDIFF(mb.fecha, o.fecha_operacion)) <= 2
            THEN 'MATCH_SOLO_FECHA'
            ELSE 'SIN_MATCH'
          END as tipo_match
          
        FROM movimientos_bancarios mb
        LEFT JOIN bancos b ON mb.id_banco = b.id
        LEFT JOIN empresa e_banco ON b.id_empresa = e_banco.id
        CROSS JOIN operaciones o
        LEFT JOIN cliente c ON o.id_cliente = c.id
        LEFT JOIN empresa e_operacion ON o.id_empresa = e_operacion.id
        
        WHERE mb.ingreso > 0  -- Solo movimientos de ingreso
          AND o.saldo > 0     -- Solo operaciones con saldo pendiente
          AND ABS(COALESCE(mb.ingreso, 0) - o.deposito) <= 1  -- Diferencia de máximo 1 peso
          AND ABS(DATEDIFF(mb.fecha, o.fecha_operacion)) <= 2  -- Diferencia de máximo 2 días
          AND e_banco.id = e_operacion.id  -- Misma empresa
          
        ORDER BY 
          CASE 
            WHEN ABS(COALESCE(mb.ingreso, 0) - o.deposito) = 0 
              AND ABS(DATEDIFF(mb.fecha, o.fecha_operacion)) = 0 
              AND e_banco.id = e_operacion.id
            THEN 1
            WHEN ABS(COALESCE(mb.ingreso, 0) - o.deposito) = 0 
              AND ABS(DATEDIFF(mb.fecha, o.fecha_operacion)) <= 1
            THEN 2
            WHEN ABS(COALESCE(mb.ingreso, 0) - o.deposito) <= 1
            THEN 3
            ELSE 4
          END,
          ABS(COALESCE(mb.ingreso, 0) - o.deposito),
          ABS(DATEDIFF(mb.fecha, o.fecha_operacion))
      `;
      
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MovimientoBancario; 
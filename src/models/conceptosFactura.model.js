const db = require('../config/database');

class ConceptosFactura {
  // Obtener todos los conceptos de factura
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT cf.*, 
               o.numero_operacion,
               o.folio_factura,
               c.nombre as nombre_cliente,
               e.nombre as nombre_empresa
        FROM conceptos_factura cf
        LEFT JOIN operaciones o ON cf.id_operacion = o.id
        LEFT JOIN cliente c ON o.id_cliente = c.id
        LEFT JOIN empresa e ON o.id_empresa = e.id
        ORDER BY cf.id DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un concepto de factura por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT cf.*, 
               o.numero_operacion,
               o.folio_factura,
               c.nombre as nombre_cliente,
               e.nombre as nombre_empresa
        FROM conceptos_factura cf
        LEFT JOIN operaciones o ON cf.id_operacion = o.id
        LEFT JOIN cliente c ON o.id_cliente = c.id
        LEFT JOIN empresa e ON o.id_empresa = e.id
        WHERE cf.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener conceptos de factura por operación
  static async findByOperacion(idOperacion) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM conceptos_factura
        WHERE id_operacion = ?
        ORDER BY id ASC
      `, [idOperacion]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo concepto de factura
  static async create(conceptoData) {
    const {
      id_operacion,
      descripcion,
      clave_sat,
      clave_unidad,
      cantidad,
      precio_unitario,
      check_con_iva,
      precio
    } = conceptoData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO conceptos_factura (
          id_operacion,
          descripcion,
          clave_sat,
          clave_unidad,
          cantidad,
          precio_unitario,
          check_con_iva,
          precio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_operacion,
          descripcion,
          clave_sat,
          clave_unidad,
          cantidad,
          precio_unitario,
          check_con_iva || false,
          precio || (cantidad * precio_unitario)
        ]
      );
      
      // Obtener el concepto creado
      const conceptoCreado = await this.findById(result.insertId);
      return conceptoCreado;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un concepto de factura
  static async update(id, conceptoData) {
    try {
      // Construir la consulta SQL dinámicamente solo con los campos que se envían
      const camposAActualizar = [];
      const valores = [];
      
      // Solo incluir campos que están definidos (no undefined)
      if (conceptoData.id_operacion !== undefined) {
        camposAActualizar.push('id_operacion = ?');
        valores.push(conceptoData.id_operacion);
      }
      
      if (conceptoData.descripcion !== undefined) {
        camposAActualizar.push('descripcion = ?');
        valores.push(conceptoData.descripcion);
      }
      
      if (conceptoData.clave_sat !== undefined) {
        camposAActualizar.push('clave_sat = ?');
        valores.push(conceptoData.clave_sat);
      }
      
      if (conceptoData.clave_unidad !== undefined) {
        camposAActualizar.push('clave_unidad = ?');
        valores.push(conceptoData.clave_unidad);
      }
      
      if (conceptoData.cantidad !== undefined) {
        camposAActualizar.push('cantidad = ?');
        valores.push(conceptoData.cantidad);
      }
      
      if (conceptoData.precio_unitario !== undefined) {
        camposAActualizar.push('precio_unitario = ?');
        valores.push(conceptoData.precio_unitario);
      }
      
      if (conceptoData.check_con_iva !== undefined) {
        camposAActualizar.push('check_con_iva = ?');
        valores.push(conceptoData.check_con_iva);
      }
      
      if (conceptoData.precio !== undefined) {
        camposAActualizar.push('precio = ?');
        valores.push(conceptoData.precio);
      }
      
      // Si no hay campos para actualizar, retornar false
      if (camposAActualizar.length === 0) {
        return false;
      }
      
      // Construir la consulta SQL dinámicamente
      const query = `UPDATE conceptos_factura SET ${camposAActualizar.join(', ')} WHERE id = ?`;
      valores.push(id);
      
      const [result] = await db.query(query, valores);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un concepto de factura
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM conceptos_factura WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar todos los conceptos de factura de una operación
  static async deleteByOperacion(idOperacion) {
    try {
      const [result] = await db.query('DELETE FROM conceptos_factura WHERE id_operacion = ?', [idOperacion]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas de conceptos por operación
  static async getEstadisticasPorOperacion(idOperacion) {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_conceptos,
          SUM(cantidad) as total_cantidad,
          SUM(cantidad * precio_unitario) as subtotal,
          SUM(cantidad * precio_unitario) * 0.16 as iva,
          SUM(cantidad * precio_unitario) * 1.16 as total
        FROM conceptos_factura
        WHERE id_operacion = ?
      `, [idOperacion]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener conceptos agrupados por clave SAT
  static async getConceptosPorClaveSat() {
    try {
      const [rows] = await db.query(`
        SELECT 
          clave_sat,
          COUNT(*) as total_conceptos,
          SUM(cantidad) as total_cantidad,
          SUM(cantidad * precio_unitario) as total_monto
        FROM conceptos_factura
        GROUP BY clave_sat
        ORDER BY total_monto DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener conceptos agrupados por clave de unidad
  static async getConceptosPorClaveUnidad() {
    try {
      const [rows] = await db.query(`
        SELECT 
          clave_unidad,
          COUNT(*) as total_conceptos,
          SUM(cantidad) as total_cantidad,
          SUM(cantidad * precio_unitario) as total_monto
        FROM conceptos_factura
        GROUP BY clave_unidad
        ORDER BY total_monto DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ConceptosFactura;

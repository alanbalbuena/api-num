const db = require('../config/database');
const ConceptosFactura = require('./conceptosFactura.model');

class Operacion {
  // Obtener todas las operaciones
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT o.*, 
               c.nombre as nombre_cliente,
               e.nombre as nombre_empresa,
               b1.nombre as nombre_broker1,
               b2.nombre as nombre_broker2,
               b3.nombre as nombre_broker3
        FROM operaciones o
        LEFT JOIN cliente c ON o.id_cliente = c.id
        LEFT JOIN empresa e ON o.id_empresa = e.id
        LEFT JOIN broker b1 ON o.id_broker1 = b1.id
        LEFT JOIN broker b2 ON o.id_broker2 = b2.id
        LEFT JOIN broker b3 ON o.id_broker3 = b3.id
        ORDER BY o.id DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una operación por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT o.*, 
               c.nombre as nombre_cliente,
               e.nombre as nombre_empresa,
               b1.nombre as nombre_broker1,
               b2.nombre as nombre_broker2,
               b3.nombre as nombre_broker3
        FROM operaciones o
        LEFT JOIN cliente c ON o.id_cliente = c.id
        LEFT JOIN empresa e ON o.id_empresa = e.id
        LEFT JOIN broker b1 ON o.id_broker1 = b1.id
        LEFT JOIN broker b2 ON o.id_broker2 = b2.id
        LEFT JOIN broker b3 ON o.id_broker3 = b3.id
        WHERE o.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener una operación por ID con sus conceptos de factura y razón social
  static async findByIdWithConceptos(id) {
    try {
      const operacion = await this.findById(id);
      if (!operacion) {
        return null;
      }
      
      const conceptos = await ConceptosFactura.findByOperacion(id);
      
      // Obtener información de razón social
      const [razonSocialRows] = await db.query(`
        SELECT * FROM razon_social 
        WHERE id_cliente = ?
      `, [operacion.id_cliente]);
      
      const razonSocial = razonSocialRows.length > 0 ? razonSocialRows[0] : null;
      
      return {
        ...operacion,
        conceptos_factura: conceptos,
        razon_social: razonSocial
      };
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva operación
  static async create(operacionData) {
    const {
      numero_operacion,
      id_cliente,
      tipo_esquema,
      porcentaje_esquema,
      id_broker1,
      porcentaje_broker1,
      id_broker2,
      porcentaje_broker2,
      id_broker3,
      porcentaje_broker3,
      deposito,
      id_empresa,
      fecha_operacion,
      folio_factura,
      referencia,
      costo,
      imagen_url,
      estatus
    } = operacionData;
    try {
      const [result] = await db.query(
        `INSERT INTO operaciones (
          numero_operacion,
          id_cliente,
          tipo_esquema,
          porcentaje_esquema,
          id_broker1,
          porcentaje_broker1,
          id_broker2,
          porcentaje_broker2,
          id_broker3,
          porcentaje_broker3,
          deposito,
          id_empresa,
          fecha_operacion,
          folio_factura,
          referencia,
          costo,
          imagen_url,
          estatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          numero_operacion,
          id_cliente,
          tipo_esquema,
          porcentaje_esquema,
          id_broker1,
          porcentaje_broker1,
          id_broker2,
          porcentaje_broker2,
          id_broker3,
          porcentaje_broker3,
          deposito,
          id_empresa,
          fecha_operacion,
          folio_factura,
          referencia,
          costo,
          imagen_url,
          estatus || 'PENDIENTE'
        ]
      );
      // El trigger se encarga de calcular el saldo automáticamente
      // Obtener la operación creada con el saldo calculado
      const operacionCreada = await this.findById(result.insertId);
      
      return operacionCreada;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una operación
  static async update(id, operacionData) {
    try {
      // Construir la consulta SQL dinámicamente solo con los campos que se envían
      const camposAActualizar = [];
      const valores = [];
      
      // Solo incluir campos que están definidos (no undefined)
      if (operacionData.numero_operacion !== undefined) {
        camposAActualizar.push('numero_operacion = ?');
        valores.push(operacionData.numero_operacion);
      }
      
      if (operacionData.id_cliente !== undefined) {
        camposAActualizar.push('id_cliente = ?');
        valores.push(operacionData.id_cliente);
      }
      
      if (operacionData.tipo_esquema !== undefined) {
        camposAActualizar.push('tipo_esquema = ?');
        valores.push(operacionData.tipo_esquema);
      }
      
      if (operacionData.porcentaje_esquema !== undefined) {
        camposAActualizar.push('porcentaje_esquema = ?');
        valores.push(operacionData.porcentaje_esquema);
      }
      
      if (operacionData.id_broker1 !== undefined) {
        camposAActualizar.push('id_broker1 = ?');
        valores.push(operacionData.id_broker1);
      }
      
      if (operacionData.porcentaje_broker1 !== undefined) {
        camposAActualizar.push('porcentaje_broker1 = ?');
        valores.push(operacionData.porcentaje_broker1);
      }
      
      if (operacionData.id_broker2 !== undefined) {
        camposAActualizar.push('id_broker2 = ?');
        valores.push(operacionData.id_broker2);
      }
      
      if (operacionData.porcentaje_broker2 !== undefined) {
        camposAActualizar.push('porcentaje_broker2 = ?');
        valores.push(operacionData.porcentaje_broker2);
      }
      
      if (operacionData.id_broker3 !== undefined) {
        camposAActualizar.push('id_broker3 = ?');
        valores.push(operacionData.id_broker3);
      }
      
      if (operacionData.porcentaje_broker3 !== undefined) {
        camposAActualizar.push('porcentaje_broker3 = ?');
        valores.push(operacionData.porcentaje_broker3);
      }
      
      if (operacionData.deposito !== undefined) {
        camposAActualizar.push('deposito = ?');
        valores.push(operacionData.deposito);
      }
      
      if (operacionData.id_empresa !== undefined) {
        camposAActualizar.push('id_empresa = ?');
        valores.push(operacionData.id_empresa);
      }
      
      if (operacionData.fecha_operacion !== undefined) {
        camposAActualizar.push('fecha_operacion = ?');
        valores.push(operacionData.fecha_operacion);
      }
      
      if (operacionData.folio_factura !== undefined) {
        camposAActualizar.push('folio_factura = ?');
        valores.push(operacionData.folio_factura);
      }
      
      if (operacionData.referencia !== undefined) {
        camposAActualizar.push('referencia = ?');
        valores.push(operacionData.referencia);
      }
      
      if (operacionData.costo !== undefined) {
        camposAActualizar.push('costo = ?');
        valores.push(operacionData.costo);
      }
      
      if (operacionData.imagen_url !== undefined) {
        camposAActualizar.push('imagen_url = ?');
        valores.push(operacionData.imagen_url);
      }
      
      if (operacionData.estatus !== undefined) {
        camposAActualizar.push('estatus = ?');
        valores.push(operacionData.estatus);
      }
      
      // Si no hay campos para actualizar, retornar false
      if (camposAActualizar.length === 0) {
        return false;
      }
      
      // Construir la consulta SQL dinámicamente
      const query = `UPDATE operaciones SET ${camposAActualizar.join(', ')} WHERE id = ?`;
      valores.push(id);
      
      const [result] = await db.query(query, valores);
      
      // El trigger se encarga de recalcular el saldo automáticamente
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una operación
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM operaciones WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }


  // Método para calcular el saldo inicial según el tipo de costo
  static calcularSaldoInicial(deposito, porcentajeEsquema, costo) {
    if (!deposito || !porcentajeEsquema) {
      return 0;
    }
    
    const porcentajeDecimal = porcentajeEsquema / 100;
    
    if (costo === 'TOTAL') {
      // Fórmula para TOTAL: (DEPOSITO * (1-PORCENTAJE_ESQUEMA))
      return deposito * (1 - porcentajeDecimal);
    } else {
      // Fórmula para SUBTOTAL: ((DEPOSITO / 1.16) * (1-PORCENTAJE_ESQUEMA))
      return (deposito / 1.16) * (1 - porcentajeDecimal);
    }
  }

  // Método para recalcular el saldo de una operación
  static async recalcularSaldo(idOperacion) {
    try {
      // Obtener datos de la operación
      const [operacion] = await db.query(
        'SELECT deposito, porcentaje_esquema, costo FROM operaciones WHERE id = ?',
        [idOperacion]
      );
      
      if (operacion.length === 0) {
        throw new Error('Operación no encontrada');
      }
      
      const { deposito, porcentaje_esquema, costo } = operacion[0];
      
      // Calcular el saldo base
      const saldoBase = this.calcularSaldoInicial(deposito, porcentaje_esquema, costo);
      
      // Obtener el total de retornos aplicados
      const [retornos] = await db.query(
        'SELECT COALESCE(SUM(monto_pagado), 0) as total_retornos FROM retornos WHERE id_operacion = ?',
        [idOperacion]
      );
      
      const totalRetornos = retornos[0].total_retornos;
      
      // Calcular el saldo final
      const saldoFinal = saldoBase - totalRetornos;
      
      // Actualizar el saldo en la base de datos
      await db.query(
        'UPDATE operaciones SET saldo = ? WHERE id = ?',
        [saldoFinal, idOperacion]
      );
      
      return saldoFinal;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Operacion; 
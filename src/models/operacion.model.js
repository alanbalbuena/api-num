const db = require('../config/database');
const ConceptosFactura = require('./conceptosFactura.model');

/**
 * Modelo para la tabla operaciones
 * Campos automáticos: created_at, updated_at (timestamps)
 * Campos de montos: subtotal, iva, total
 * Campos de comisiones: porcentaje_cms_general, cms_general_num, fondo_ahorro, cms_fondo_ahorro_libre, cms_hector, cms_kuri
 */
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
      estatus,
      subtotal,
      iva,
      total,
      porcentaje_cms_general,
      cms_general_num,
      fondo_ahorro,
      cms_fondo_ahorro_libre,
      cms_hector,
      cms_kuri
    } = operacionData;
    
    // Calcular automáticamente los campos de comisiones
    const comisionesCalculadas = this.calcularComisiones(operacionData);
    
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
          estatus,
          subtotal,
          iva,
          total,
          porcentaje_cms_general,
          cms_general_num,
          fondo_ahorro,
          cms_fondo_ahorro_libre,
          cms_hector,
          cms_kuri
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          estatus || 'PENDIENTE',
          subtotal || 0.00,
          iva || 0.00,
          total || 0.00,
          comisionesCalculadas.porcentaje_cms_general,
          comisionesCalculadas.cms_general_num,
          comisionesCalculadas.fondo_ahorro,
          comisionesCalculadas.cms_fondo_ahorro_libre,
          comisionesCalculadas.cms_hector,
          comisionesCalculadas.cms_kuri
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
      // Extraer conceptos_factura de los datos si están presentes
      const { conceptos_factura, ...datosOperacionInicial } = operacionData;
      let datosOperacion = { ...datosOperacionInicial };

      // Verificar si se modificaron campos que requieren recálculo de comisiones
      const camposQueRequierenRecalculo = [
        'porcentaje_esquema', 'porcentaje_broker1', 'porcentaje_broker2', 'porcentaje_broker3',
        'costo', 'total', 'subtotal'
      ];
      
      const necesitaRecalculo = camposQueRequierenRecalculo.some(campo => 
        datosOperacion[campo] !== undefined
      );

      // Si necesita recálculo, obtener los datos actuales de la operación
      let datosCompletos = { ...datosOperacion };
      if (necesitaRecalculo) {
        const operacionActual = await this.findById(id);
        if (!operacionActual) {
          throw new Error('Operación no encontrada');
        }
        
        // Combinar datos actuales con los nuevos datos
        datosCompletos = {
          porcentaje_esquema: operacionActual.porcentaje_esquema,
          porcentaje_broker1: operacionActual.porcentaje_broker1,
          porcentaje_broker2: operacionActual.porcentaje_broker2,
          porcentaje_broker3: operacionActual.porcentaje_broker3,
          costo: operacionActual.costo,
          total: operacionActual.total,
          subtotal: operacionActual.subtotal,
          ...datosOperacion // Los nuevos datos sobrescriben los actuales
        };
        
        // Calcular las nuevas comisiones
        const comisionesCalculadas = this.calcularComisiones(datosCompletos);
        
        // Agregar las comisiones calculadas a los datos a actualizar
        datosOperacion = {
          ...datosOperacion,
          ...comisionesCalculadas
        };
      }

      // Construir la consulta SQL dinámicamente solo con los campos que se envían
      const camposAActualizar = [];
      const valores = [];
      
      // Solo incluir campos que están definidos (no undefined)
      if (datosOperacion.numero_operacion !== undefined) {
        camposAActualizar.push('numero_operacion = ?');
        valores.push(datosOperacion.numero_operacion);
      }
      
      if (datosOperacion.id_cliente !== undefined) {
        camposAActualizar.push('id_cliente = ?');
        valores.push(datosOperacion.id_cliente);
      }
      
      if (datosOperacion.tipo_esquema !== undefined) {
        camposAActualizar.push('tipo_esquema = ?');
        valores.push(datosOperacion.tipo_esquema);
      }
      
      if (datosOperacion.porcentaje_esquema !== undefined) {
        camposAActualizar.push('porcentaje_esquema = ?');
        valores.push(datosOperacion.porcentaje_esquema);
      }
      
      if (datosOperacion.id_broker1 !== undefined) {
        camposAActualizar.push('id_broker1 = ?');
        valores.push(datosOperacion.id_broker1);
      }
      
      if (datosOperacion.porcentaje_broker1 !== undefined) {
        camposAActualizar.push('porcentaje_broker1 = ?');
        valores.push(datosOperacion.porcentaje_broker1);
      }
      
      if (datosOperacion.id_broker2 !== undefined) {
        camposAActualizar.push('id_broker2 = ?');
        valores.push(datosOperacion.id_broker2);
      }
      
      if (datosOperacion.porcentaje_broker2 !== undefined) {
        camposAActualizar.push('porcentaje_broker2 = ?');
        valores.push(datosOperacion.porcentaje_broker2);
      }
      
      if (datosOperacion.id_broker3 !== undefined) {
        camposAActualizar.push('id_broker3 = ?');
        valores.push(datosOperacion.id_broker3);
      }
      
      if (datosOperacion.porcentaje_broker3 !== undefined) {
        camposAActualizar.push('porcentaje_broker3 = ?');
        valores.push(datosOperacion.porcentaje_broker3);
      }
      
      if (datosOperacion.deposito !== undefined) {
        camposAActualizar.push('deposito = ?');
        valores.push(datosOperacion.deposito);
      }
      
      if (datosOperacion.id_empresa !== undefined) {
        camposAActualizar.push('id_empresa = ?');
        valores.push(datosOperacion.id_empresa);
      }
      
      if (datosOperacion.fecha_operacion !== undefined) {
        camposAActualizar.push('fecha_operacion = ?');
        valores.push(datosOperacion.fecha_operacion);
      }
      
      if (datosOperacion.folio_factura !== undefined) {
        camposAActualizar.push('folio_factura = ?');
        valores.push(datosOperacion.folio_factura);
      }
      
      if (datosOperacion.referencia !== undefined) {
        camposAActualizar.push('referencia = ?');
        valores.push(datosOperacion.referencia);
      }
      
      if (datosOperacion.costo !== undefined) {
        camposAActualizar.push('costo = ?');
        valores.push(datosOperacion.costo);
      }
      
      if (datosOperacion.imagen_url !== undefined) {
        camposAActualizar.push('imagen_url = ?');
        valores.push(datosOperacion.imagen_url);
      }
      
      if (datosOperacion.estatus !== undefined) {
        camposAActualizar.push('estatus = ?');
        valores.push(datosOperacion.estatus);
      }
      
      if (datosOperacion.subtotal !== undefined) {
        camposAActualizar.push('subtotal = ?');
        valores.push(datosOperacion.subtotal);
      }
      
      if (datosOperacion.iva !== undefined) {
        camposAActualizar.push('iva = ?');
        valores.push(datosOperacion.iva);
      }
      
      if (datosOperacion.total !== undefined) {
        camposAActualizar.push('total = ?');
        valores.push(datosOperacion.total);
      }
      
      if (datosOperacion.porcentaje_cms_general !== undefined) {
        camposAActualizar.push('porcentaje_cms_general = ?');
        valores.push(datosOperacion.porcentaje_cms_general);
      }
      
      if (datosOperacion.cms_general_num !== undefined) {
        camposAActualizar.push('cms_general_num = ?');
        valores.push(datosOperacion.cms_general_num);
      }
      
      if (datosOperacion.fondo_ahorro !== undefined) {
        camposAActualizar.push('fondo_ahorro = ?');
        valores.push(datosOperacion.fondo_ahorro);
      }
      
      if (datosOperacion.cms_fondo_ahorro_libre !== undefined) {
        camposAActualizar.push('cms_fondo_ahorro_libre = ?');
        valores.push(datosOperacion.cms_fondo_ahorro_libre);
      }
      
      if (datosOperacion.cms_hector !== undefined) {
        camposAActualizar.push('cms_hector = ?');
        valores.push(datosOperacion.cms_hector);
      }
      
      if (datosOperacion.cms_kuri !== undefined) {
        camposAActualizar.push('cms_kuri = ?');
        valores.push(datosOperacion.cms_kuri);
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
      
      // Actualizar conceptos de factura si se proporcionaron
      let conceptosActualizados = [];
      if (conceptos_factura !== undefined) {
        conceptosActualizados = await this.actualizarConceptosFactura(id, conceptos_factura);
      }
      
      return {
        operacionActualizada: result.affectedRows > 0,
        conceptosActualizados: conceptosActualizados
      };
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

  // Método para calcular automáticamente los campos de comisiones
  static calcularComisiones(operacionData) {
    const {
      porcentaje_esquema,
      porcentaje_broker1,
      porcentaje_broker2,
      porcentaje_broker3,
      costo,
      total,
      subtotal
    } = operacionData;

    // Calcular porcentaje_cms_general = porcentaje_esquema - porcentaje_broker1 - porcentaje_broker2 - porcentaje_broker3
    const porcentaje_cms_general = (porcentaje_esquema || 0) - 
                                  (porcentaje_broker1 || 0) - 
                                  (porcentaje_broker2 || 0) - 
                                  (porcentaje_broker3 || 0);

    // Calcular cms_general_num según el tipo de costo
    let cms_general_num = 0;
    if (costo === 'TOTAL' && total) {
      cms_general_num = (porcentaje_cms_general / 100) * total;
    } else if (costo === 'SUBTOTAL' && subtotal) {
      cms_general_num = (porcentaje_cms_general / 100) * subtotal;
    }

    // Calcular fondo_ahorro = cms_general_num * 0.10
    const fondo_ahorro = cms_general_num * 0.10;

    // Calcular cms_fondo_ahorro_libre = cms_general_num - fondo_ahorro
    const cms_fondo_ahorro_libre = cms_general_num - fondo_ahorro;

    // Calcular cms_hector = cms_fondo_ahorro_libre / 2
    const cms_hector = cms_fondo_ahorro_libre / 2;

    // Calcular cms_kuri = cms_fondo_ahorro_libre / 2
    const cms_kuri = cms_fondo_ahorro_libre / 2;

    return {
      porcentaje_cms_general: Math.max(0, porcentaje_cms_general), // No permitir valores negativos
      cms_general_num: Math.max(0, cms_general_num),
      fondo_ahorro: Math.max(0, fondo_ahorro),
      cms_fondo_ahorro_libre: Math.max(0, cms_fondo_ahorro_libre),
      cms_hector: Math.max(0, cms_hector),
      cms_kuri: Math.max(0, cms_kuri)
    };
  }

  // Método para actualizar conceptos de factura de una operación
  static async actualizarConceptosFactura(idOperacion, conceptosData) {
    try {
      // Si no se proporcionan conceptos, no hacer nada
      if (!conceptosData || !Array.isArray(conceptosData)) {
        return [];
      }

      // Eliminar todos los conceptos existentes de la operación
      await ConceptosFactura.deleteByOperacion(idOperacion);

      // Crear los nuevos conceptos
      const conceptosCreados = [];
      for (const conceptoData of conceptosData) {
        // Validar que el concepto tenga los campos requeridos
        if (conceptoData.descripcion && conceptoData.clave_sat && 
            conceptoData.clave_unidad && conceptoData.cantidad && 
            conceptoData.precio_unitario) {
          
          const conceptoCreado = await ConceptosFactura.create({
            id_operacion: idOperacion,
            descripcion: conceptoData.descripcion,
            clave_sat: conceptoData.clave_sat,
            clave_unidad: conceptoData.clave_unidad,
            cantidad: conceptoData.cantidad,
            precio_unitario: conceptoData.precio_unitario,
            check_con_iva: conceptoData.check_con_iva || false,
            precio: conceptoData.precio || (conceptoData.cantidad * conceptoData.precio_unitario)
          });
          conceptosCreados.push(conceptoCreado);
        }
      }

      return conceptosCreados;
    } catch (error) {
      throw error;
    }
  }

  // Método para recalcular comisiones de una operación existente
  static async recalcularComisiones(idOperacion) {
    try {
      // Obtener datos de la operación
      const operacion = await this.findById(idOperacion);
      if (!operacion) {
        throw new Error('Operación no encontrada');
      }

      // Calcular las nuevas comisiones
      const comisionesCalculadas = this.calcularComisiones(operacion);

      // Actualizar solo los campos de comisiones
      const camposAActualizar = [];
      const valores = [];

      camposAActualizar.push('porcentaje_cms_general = ?');
      valores.push(comisionesCalculadas.porcentaje_cms_general);
      
      camposAActualizar.push('cms_general_num = ?');
      valores.push(comisionesCalculadas.cms_general_num);
      
      camposAActualizar.push('fondo_ahorro = ?');
      valores.push(comisionesCalculadas.fondo_ahorro);
      
      camposAActualizar.push('cms_fondo_ahorro_libre = ?');
      valores.push(comisionesCalculadas.cms_fondo_ahorro_libre);
      
      camposAActualizar.push('cms_hector = ?');
      valores.push(comisionesCalculadas.cms_hector);
      
      camposAActualizar.push('cms_kuri = ?');
      valores.push(comisionesCalculadas.cms_kuri);

      // Ejecutar la actualización
      const query = `UPDATE operaciones SET ${camposAActualizar.join(', ')} WHERE id = ?`;
      valores.push(idOperacion);
      
      await db.query(query, valores);

      return comisionesCalculadas;
    } catch (error) {
      throw error;
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

  // Obtener operaciones no completamente pagadas (saldo > 0)
  static async findNoCompletamentePagadas() {
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
        WHERE o.saldo > 0
        ORDER BY o.id DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Operacion; 
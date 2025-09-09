const Operacion = require('../models/operacion.model');
const ConceptosFactura = require('../models/conceptosFactura.model');

// Obtener operaciones por estatus
exports.getOperacionesByEstatus = async (req, res) => {
  try {
    const { estatus } = req.params;
    
    // Validar que el estatus sea válido
    if (!['PENDIENTE', 'PREVIA', 'FACTURADA'].includes(estatus)) {
      return res.status(400).json({
        error: 'Estatus inválido',
        message: 'El estatus debe ser uno de: PENDIENTE, PREVIA, FACTURADA'
      });
    }
    
    const operaciones = await Operacion.findByEstatus(estatus);
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones por estatus:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones'
    });
  }
};

// Obtener operaciones pendientes
exports.getOperacionesPendientes = async (req, res) => {
  try {
    const operaciones = await Operacion.findPendientes();
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones pendientes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones pendientes'
    });
  }
};

// Obtener operaciones previa
exports.getOperacionesPrevia = async (req, res) => {
  try {
    const operaciones = await Operacion.findPrevia();
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones previa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones previa'
    });
  }
};

// Obtener operaciones facturadas
exports.getOperacionesFacturadas = async (req, res) => {
  try {
    const operaciones = await Operacion.findFacturadas();
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones facturadas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones facturadas'
    });
  }
};

// Obtener todas las operaciones
exports.getAllOperaciones = async (req, res) => {
  try {
    const operaciones = await Operacion.findAll();
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones'
    });
  }
};

// Obtener una operación por ID
exports.getOperacionById = async (req, res) => {
  try {
    const operacion = await Operacion.findById(req.params.id);
    if (!operacion) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }
    res.json(operacion);
  } catch (error) {
    console.error('Error al obtener operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la operación'
    });
  }
};

// Obtener una operación por ID con sus conceptos de factura
exports.getOperacionByIdWithConceptos = async (req, res) => {
  try {
    const operacion = await Operacion.findByIdWithConceptos(req.params.id);
    if (!operacion) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }
    res.json(operacion);
  } catch (error) {
    console.error('Error al obtener operación con conceptos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la operación'
    });
  }
};

// Crear una nueva operación
exports.createOperacion = async (req, res) => {
  try {
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
      estatus,
      conceptos_factura // Nueva propiedad para recibir lista de conceptos
    } = req.body;

    // Validación básica
    if (
      !id_cliente ||
      !tipo_esquema ||
      !porcentaje_esquema ||
      !id_empresa ||
      !fecha_operacion
    ) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan campos obligatorios: id_cliente, tipo_esquema, porcentaje_esquema, id_empresa, fecha_operacion'
      });
    }

    // Validar que tipo_esquema sea válido
    const tiposEsquemaValidos = ['FACTURA', 'SINDICATO', 'SAPI', 'C909', 'BANCARIZACION', 'CONTABILIDAD'];
    if (!tiposEsquemaValidos.includes(tipo_esquema)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'tipo_esquema debe ser uno de: FACTURA, SINDICATO, SAPI, C909, BANCARIZACION, CONTABILIDAD'
      });
    }

    // Validar que costo sea válido si se proporciona
    if (costo && !['SUBTOTAL', 'TOTAL'].includes(costo)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'costo debe ser uno de: SUBTOTAL, TOTAL'
      });
    }

    // Validar que estatus sea válido si se proporciona
    if (estatus && !['PENDIENTE', 'PREVIA', 'FACTURADA'].includes(estatus)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'estatus debe ser uno de: PENDIENTE, PREVIA, FACTURADA'
      });
    }

    // Validar conceptos de factura si se proporcionan
    if (conceptos_factura && Array.isArray(conceptos_factura)) {
      for (const concepto of conceptos_factura) {
        if (!concepto.descripcion || !concepto.clave_sat || !concepto.clave_unidad || 
            !concepto.cantidad || !concepto.precio_unitario) {
          return res.status(400).json({
            error: 'Datos incompletos',
            message: 'Cada concepto de factura debe tener: descripcion, clave_sat, clave_unidad, cantidad, precio_unitario'
          });
        }
        
        if (concepto.cantidad <= 0 || concepto.precio_unitario <= 0) {
          return res.status(400).json({
            error: 'Datos inválidos',
            message: 'cantidad y precio_unitario deben ser números positivos'
          });
        }
      }
    }

    // Procesar imagen si se subió - la API asigna la ruta automáticamente
    let imagenUrl = null;
    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    }

    // Crear la operación
    const nuevaOperacion = await Operacion.create({
      numero_operacion: numero_operacion || null,
      id_cliente,
      tipo_esquema,
      porcentaje_esquema,
      id_broker1: id_broker1 || null,
      porcentaje_broker1: porcentaje_broker1 || null,
      id_broker2: id_broker2 || null,
      porcentaje_broker2: porcentaje_broker2 || null,
      id_broker3: id_broker3 || null,
      porcentaje_broker3: porcentaje_broker3 || null,
      deposito: deposito || null,
      id_empresa,
      fecha_operacion,
      folio_factura: folio_factura || null,
      referencia: referencia || null,
      costo: costo || 'SUBTOTAL',
      imagen_url: imagenUrl,
      estatus: estatus || 'PENDIENTE'
    });

    // Crear los conceptos de factura si se proporcionaron
    let conceptosCreados = [];
    if (conceptos_factura && Array.isArray(conceptos_factura) && conceptos_factura.length > 0) {
      for (const conceptoData of conceptos_factura) {
        const conceptoCreado = await ConceptosFactura.create({
          id_operacion: nuevaOperacion.id,
          descripcion: conceptoData.descripcion,
          clave_sat: conceptoData.clave_sat,
          clave_unidad: conceptoData.clave_unidad,
          cantidad: conceptoData.cantidad,
          precio_unitario: conceptoData.precio_unitario
        });
        conceptosCreados.push(conceptoCreado);
      }
    }

    // Preparar respuesta con la operación y sus conceptos
    const respuesta = {
      ...nuevaOperacion,
      conceptos_factura: conceptosCreados
    };

    res.status(201).json({
      message: 'Operación creada exitosamente',
      operacion: respuesta
    });
  } catch (error) {
    console.error('Error al crear operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear la operación'
    });
  }
};

// Actualizar una operación
exports.updateOperacion = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Obtener la operación existente para validar que existe
    const operacionExistente = await Operacion.findById(id);
    if (!operacionExistente) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }

    // Solo validar y actualizar los campos que se envían
    const camposAActualizar = {};
    
    // Campos seguros para actualizar individualmente
    if (req.body.numero_operacion !== undefined) {
      camposAActualizar.numero_operacion = req.body.numero_operacion;
    }
    
    if (req.body.deposito !== undefined) {
      if (req.body.deposito < 0) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'deposito no puede ser negativo'
        });
      }
      camposAActualizar.deposito = req.body.deposito;
    }
    
    if (req.body.porcentaje_esquema !== undefined) {
      if (!req.body.porcentaje_esquema || req.body.porcentaje_esquema <= 0 || req.body.porcentaje_esquema > 100) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'porcentaje_esquema debe estar entre 0 y 100'
        });
      }
      camposAActualizar.porcentaje_esquema = req.body.porcentaje_esquema;
    }
    
    if (req.body.costo !== undefined) {
      if (!['SUBTOTAL', 'TOTAL'].includes(req.body.costo)) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'costo debe ser uno de: SUBTOTAL, TOTAL'
        });
      }
      camposAActualizar.costo = req.body.costo;
    }
    
    if (req.body.estatus !== undefined) {
      if (!['PENDIENTE', 'PREVIA', 'FACTURADA'].includes(req.body.estatus)) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'estatus debe ser uno de: PENDIENTE, PREVIA, FACTURADA'
        });
      }
      camposAActualizar.estatus = req.body.estatus;
      console.log('Estatus agregado a camposAActualizar:', req.body.estatus);
    }
    
         if (req.body.folio_factura !== undefined) {
       camposAActualizar.folio_factura = req.body.folio_factura;
     }
     
     if (req.body.referencia !== undefined) {
       camposAActualizar.referencia = req.body.referencia;
     }
    
    if (req.body.fecha_operacion !== undefined) {
      // Validar formato de fecha
      const fecha = new Date(req.body.fecha_operacion);
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'fecha_operacion debe tener un formato válido (YYYY-MM-DD)'
        });
      }
      camposAActualizar.fecha_operacion = req.body.fecha_operacion;
    }
    
    // Campos de brokers (solo si se envían todos juntos para mantener consistencia)
    if (req.body.id_broker1 !== undefined || req.body.porcentaje_broker1 !== undefined ||
        req.body.id_broker2 !== undefined || req.body.porcentaje_broker2 !== undefined ||
        req.body.id_broker3 !== undefined || req.body.porcentaje_broker3 !== undefined) {
      
      // Validar que si se envía un broker, se envíe también su porcentaje
      if ((req.body.id_broker1 !== undefined && req.body.porcentaje_broker1 === undefined) ||
          (req.body.id_broker1 === undefined && req.body.porcentaje_broker1 !== undefined)) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'Si se envía id_broker1, también debe enviarse porcentaje_broker1'
        });
      }
      
      if ((req.body.id_broker2 !== undefined && req.body.porcentaje_broker2 === undefined) ||
          (req.body.id_broker2 === undefined && req.body.porcentaje_broker2 !== undefined)) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'Si se envía id_broker2, también debe enviarse porcentaje_broker2'
        });
      }
      
      if ((req.body.id_broker3 !== undefined && req.body.porcentaje_broker3 === undefined) ||
          (req.body.id_broker3 === undefined && req.body.porcentaje_broker3 !== undefined)) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'Si se envía id_broker3, también debe enviarse porcentaje_broker3'
        });
      }
      
      // Agregar campos de brokers
      if (req.body.id_broker1 !== undefined) camposAActualizar.id_broker1 = req.body.id_broker1;
      if (req.body.porcentaje_broker1 !== undefined) camposAActualizar.porcentaje_broker1 = req.body.porcentaje_broker1;
      if (req.body.id_broker2 !== undefined) camposAActualizar.id_broker2 = req.body.id_broker2;
      if (req.body.porcentaje_broker2 !== undefined) camposAActualizar.porcentaje_broker2 = req.body.porcentaje_broker2;
      if (req.body.id_broker3 !== undefined) camposAActualizar.id_broker3 = req.body.id_broker3;
      if (req.body.porcentaje_broker3 !== undefined) camposAActualizar.porcentaje_broker3 = req.body.porcentaje_broker3;
    }
    
    // Procesar imagen si se subió
    if (req.file) {
      camposAActualizar.imagen_url = `/uploads/${req.file.filename}`;
    }
    
    // Validar que al menos un campo se vaya a actualizar
    if (Object.keys(camposAActualizar).length === 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Debe enviar al menos un campo para actualizar'
      });
    }

    // Actualizar solo con los campos proporcionados
    console.log('Campos a actualizar:', camposAActualizar);
    const actualizado = await Operacion.update(id, camposAActualizar);

    if (!actualizado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la operación'
      });
    }

    // Obtener la operación actualizada
    const operacionActualizada = await Operacion.findById(id);

    res.json({
      message: 'Operación actualizada exitosamente',
      campos_actualizados: Object.keys(camposAActualizar),
      operacion: operacionActualizada
    });
  } catch (error) {
    console.error('Error al actualizar operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la operación'
    });
  }
};

// Eliminar una operación
exports.deleteOperacion = async (req, res) => {
  try {
    const eliminado = await Operacion.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }
    res.json({
      message: 'Operación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la operación'
    });
  }
};

// Obtener operaciones sin pagos aplicados
exports.getOperacionesSinPagos = async (req, res) => {
  try {
    const operaciones = await Operacion.findSinPagosAplicados();
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones sin pagos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones sin pagos'
    });
  }
};

// Obtener operaciones con pagos parciales
exports.getOperacionesConPagosParciales = async (req, res) => {
  try {
    const operaciones = await Operacion.findConPagosParciales();
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones con pagos parciales:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones con pagos parciales'
    });
  }
};

// Obtener operaciones completamente pagadas
exports.getOperacionesCompletamentePagadas = async (req, res) => {
  try {
    const operaciones = await Operacion.findCompletamentePagadas();
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones completamente pagadas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones completamente pagadas'
    });
  }
};

// Obtener estadísticas de pagos de una operación
exports.getEstadisticasPagos = async (req, res) => {
  try {
    const estadisticas = await Operacion.getEstadisticasPagos(req.params.id);
    if (!estadisticas) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de pagos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas de pagos'
    });
  }
};

// Obtener operaciones no completamente pagadas (sin pagos + parciales)
exports.getOperacionesNoCompletamentePagadas = async (req, res) => {
  try {
    const empresaId = req.query.empresa || req.params.empresaId;
    const operaciones = await Operacion.findNoCompletamentePagadas(empresaId);
    res.json(operaciones);
  } catch (error) {
    console.error('Error al obtener operaciones no completamente pagadas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las operaciones no completamente pagadas'
    });
  }
};

// Subir imagen para una operación
exports.uploadImagen = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la operación existe
    const operacion = await Operacion.findById(id);
    if (!operacion) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }

    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        error: 'Archivo requerido',
        message: 'Debe subir una imagen'
      });
    }

    // Generar URL de la imagen
    const imagenUrl = `/uploads/${req.file.filename}`;
    
    // Actualizar la operación con la URL de la imagen
    const actualizado = await Operacion.update(id, {
      ...operacion,
      imagen_url: imagenUrl
    });

    if (!actualizado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la operación'
      });
    }

    // Obtener la operación actualizada
    const operacionActualizada = await Operacion.findById(id);

    res.json({
      message: 'Imagen subida exitosamente',
      operacion: operacionActualizada
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo subir la imagen'
    });
  }
};

// Eliminar imagen de una operación
exports.deleteImagen = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la operación existe
    const operacion = await Operacion.findById(id);
    if (!operacion) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }

    // Verificar si la operación tiene una imagen
    if (!operacion.imagen_url) {
      return res.status(400).json({
        error: 'Sin imagen',
        message: 'La operación no tiene una imagen asociada'
      });
    }

    // Eliminar el archivo físico si existe
    const fs = require('fs');
    const path = require('path');
    const { uploadDir } = require('../middleware/upload');
    
    const imagenPath = path.join(uploadDir, path.basename(operacion.imagen_url));
    if (fs.existsSync(imagenPath)) {
      fs.unlinkSync(imagenPath);
    }

    // Actualizar la operación eliminando la URL de la imagen
    const actualizado = await Operacion.update(id, {
      ...operacion,
      imagen_url: null
    });

    if (!actualizado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la operación'
      });
    }

    // Obtener la operación actualizada
    const operacionActualizada = await Operacion.findById(id);

    res.json({
      message: 'Imagen eliminada exitosamente',
      operacion: operacionActualizada
    });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la imagen'
    });
  }
};

// Recalcular saldo de una operación
exports.recalcularSaldo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la operación existe
    const operacion = await Operacion.findById(id);
    if (!operacion) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Operación no encontrada'
      });
    }

    // Recalcular el saldo
    const nuevoSaldo = await Operacion.recalcularSaldo(id);
    
    // Obtener la operación actualizada
    const operacionActualizada = await Operacion.findById(id);

    res.json({
      message: 'Saldo recalculado exitosamente',
      saldo_anterior: operacion.saldo,
      saldo_nuevo: nuevoSaldo,
      operacion: operacionActualizada
    });
  } catch (error) {
    console.error('Error al recalcular saldo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo recalcular el saldo'
    });
  }
}; 
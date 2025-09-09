const ConceptosFactura = require('../models/conceptosFactura.model');

// Obtener todos los conceptos de factura
exports.getAllConceptosFactura = async (req, res) => {
  try {
    const conceptos = await ConceptosFactura.findAll();
    res.json(conceptos);
  } catch (error) {
    console.error('Error al obtener conceptos de factura:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los conceptos de factura'
    });
  }
};

// Obtener un concepto de factura por ID
exports.getConceptoFacturaById = async (req, res) => {
  try {
    const concepto = await ConceptosFactura.findById(req.params.id);
    if (!concepto) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Concepto de factura no encontrado'
      });
    }
    res.json(concepto);
  } catch (error) {
    console.error('Error al obtener concepto de factura:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el concepto de factura'
    });
  }
};

// Obtener conceptos de factura por operación
exports.getConceptosFacturaByOperacion = async (req, res) => {
  try {
    const conceptos = await ConceptosFactura.findByOperacion(req.params.idOperacion);
    res.json(conceptos);
  } catch (error) {
    console.error('Error al obtener conceptos de factura por operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los conceptos de factura'
    });
  }
};

// Crear un nuevo concepto de factura
exports.createConceptoFactura = async (req, res) => {
  try {
    const {
      id_operacion,
      descripcion,
      clave_sat,
      clave_unidad,
      cantidad,
      precio_unitario
    } = req.body;

    // Validación básica
    if (
      !id_operacion ||
      !descripcion ||
      !clave_sat ||
      !clave_unidad ||
      !cantidad ||
      !precio_unitario
    ) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan campos obligatorios: id_operacion, descripcion, clave_sat, clave_unidad, cantidad, precio_unitario'
      });
    }

    // Validar que cantidad y precio_unitario sean números positivos
    if (cantidad <= 0 || precio_unitario <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'cantidad y precio_unitario deben ser números positivos'
      });
    }

    const nuevoConcepto = await ConceptosFactura.create({
      id_operacion,
      descripcion,
      clave_sat,
      clave_unidad,
      cantidad,
      precio_unitario
    });

    res.status(201).json({
      message: 'Concepto de factura creado exitosamente',
      concepto: nuevoConcepto
    });
  } catch (error) {
    console.error('Error al crear concepto de factura:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el concepto de factura'
    });
  }
};

// Actualizar un concepto de factura
exports.updateConceptoFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar que cantidad y precio_unitario sean números positivos si se proporcionan
    if (updateData.cantidad !== undefined && updateData.cantidad <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'cantidad debe ser un número positivo'
      });
    }

    if (updateData.precio_unitario !== undefined && updateData.precio_unitario <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'precio_unitario debe ser un número positivo'
      });
    }

    const actualizado = await ConceptosFactura.update(id, updateData);
    
    if (!actualizado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Concepto de factura no encontrado'
      });
    }

    // Obtener el concepto actualizado
    const conceptActualizado = await ConceptosFactura.findById(id);
    
    res.json({
      message: 'Concepto de factura actualizado exitosamente',
      concepto: conceptActualizado
    });
  } catch (error) {
    console.error('Error al actualizar concepto de factura:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el concepto de factura'
    });
  }
};

// Eliminar un concepto de factura
exports.deleteConceptoFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await ConceptosFactura.delete(id);
    
    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Concepto de factura no encontrado'
      });
    }

    res.json({
      message: 'Concepto de factura eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar concepto de factura:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el concepto de factura'
    });
  }
};

// Eliminar todos los conceptos de factura de una operación
exports.deleteConceptosFacturaByOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;
    const eliminados = await ConceptosFactura.deleteByOperacion(idOperacion);
    
    res.json({
      message: `${eliminados} conceptos de factura eliminados exitosamente`,
      eliminados: eliminados
    });
  } catch (error) {
    console.error('Error al eliminar conceptos de factura por operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron eliminar los conceptos de factura'
    });
  }
};

// Obtener estadísticas de conceptos por operación
exports.getEstadisticasConceptosPorOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;
    const estadisticas = await ConceptosFactura.getEstadisticasPorOperacion(idOperacion);
    
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de conceptos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
};

// Obtener conceptos agrupados por clave SAT
exports.getConceptosPorClaveSat = async (req, res) => {
  try {
    const conceptos = await ConceptosFactura.getConceptosPorClaveSat();
    res.json(conceptos);
  } catch (error) {
    console.error('Error al obtener conceptos por clave SAT:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los conceptos por clave SAT'
    });
  }
};

// Obtener conceptos agrupados por clave de unidad
exports.getConceptosPorClaveUnidad = async (req, res) => {
  try {
    const conceptos = await ConceptosFactura.getConceptosPorClaveUnidad();
    res.json(conceptos);
  } catch (error) {
    console.error('Error al obtener conceptos por clave de unidad:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los conceptos por clave de unidad'
    });
  }
};

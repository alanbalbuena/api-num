const Esquema = require('../models/esquema.model');
const Cliente = require('../models/cliente.model');
const RazonSocial = require('../models/razonSocial.model');

// Obtener todos los esquemas
exports.getAllEsquemas = async (req, res) => {
  try {
    const esquemas = await Esquema.findAll();
    res.json(esquemas);
  } catch (error) {
    console.error('Error al obtener esquemas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los esquemas'
    });
  }
};

// Obtener esquemas por cliente
exports.getEsquemasByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const esquemas = await Esquema.findByClienteId(clienteId);
    res.json(esquemas);
  } catch (error) {
    console.error('Error al obtener esquemas del cliente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los esquemas del cliente'
    });
  }
};

// Obtener esquemas por razón social
exports.getEsquemasByRazonSocial = async (req, res) => {
  try {
    const { razonSocialId } = req.params;
    const esquemas = await Esquema.findByRazonSocialId(razonSocialId);
    res.json(esquemas);
  } catch (error) {
    console.error('Error al obtener esquemas de la razón social:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los esquemas de la razón social'
    });
  }
};

// Crear un nuevo esquema
exports.createEsquema = async (req, res) => {
  try {
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
    } = req.body;

    // Validaciones
    if (!id_razon_social || !tipo_esquema) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'id_razon_social y tipo_esquema son obligatorios'
      });
    }

    // Convertir ID a número para validación
    const razonSocialId = parseInt(id_razon_social);

    if (isNaN(razonSocialId)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'id_razon_social debe ser un número válido'
      });
    }

    // Verificar que la razón social existe
    const razonSocial = await RazonSocial.findById(razonSocialId);
    if (!razonSocial) {
      return res.status(404).json({
        error: 'Razón social no encontrada',
        message: 'La razón social especificada no existe'
      });
    }

    // Verificar que no existe un esquema del mismo tipo para esta razón social
    const esquemaExistente = await Esquema.findByRazonSocialAndType(razonSocialId, tipo_esquema.toUpperCase());
    if (esquemaExistente) {
      return res.status(400).json({
        error: 'Esquema duplicado',
        message: 'Ya existe un esquema de este tipo para esta razón social'
      });
    }

    const nuevoEsquema = await Esquema.create({
      id_razon_social: razonSocialId,
      tipo_esquema: tipo_esquema.toUpperCase(),
      porcentaje_esquema,
      costo: costo || 'TOTAL',
      id_broker1,
      porcentaje_broker1,
      id_broker2,
      porcentaje_broker2,
      id_broker3,
      porcentaje_broker3
    });

    res.status(201).json({
      message: 'Esquema creado exitosamente',
      esquema: nuevoEsquema
    });
  } catch (error) {
    console.error('Error al crear esquema:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el esquema'
    });
  }
};

// Actualizar un esquema
exports.updateEsquema = async (req, res) => {
  try {
    const { id } = req.params;
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
    } = req.body;

    // Verificar que el esquema existe
    const esquemaExistente = await Esquema.findById(id);
    if (!esquemaExistente) {
      return res.status(404).json({
        error: 'Esquema no encontrado',
        message: 'El esquema especificado no existe'
      });
    }

    const actualizado = await Esquema.update(id, {
      id_razon_social,
      tipo_esquema: tipo_esquema ? tipo_esquema.toUpperCase() : esquemaExistente.tipo_esquema,
      porcentaje_esquema,
      costo: costo || 'TOTAL',
      id_broker1,
      porcentaje_broker1,
      id_broker2,
      porcentaje_broker2,
      id_broker3,
      porcentaje_broker3
    });

    if (!actualizado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Esquema no encontrado'
      });
    }

    // Obtener el esquema actualizado
    const esquemaActualizado = await Esquema.findById(id);
    res.json({
      message: 'Esquema actualizado exitosamente',
      esquema: esquemaActualizado
    });
  } catch (error) {
    console.error('Error al actualizar esquema:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el esquema'
    });
  }
};

// Eliminar un esquema
exports.deleteEsquema = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Esquema.delete(id);
    
    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Esquema no encontrado'
      });
    }

    res.json({
      message: 'Esquema eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar esquema:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el esquema'
    });
  }
};

const Cliente = require('../models/cliente.model');
const db = require('../config/database');

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const { search, q } = req.query;
    const searchTerm = search || q;
    const clientes = await Cliente.findAll(searchTerm);
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los clientes'
    });
  }
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Cliente no encontrado'
      });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el cliente'
    });
  }
};







// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  try {
    const { 
      nombre, 
      sede, 
      esquema,
      origen
    } = req.body;

    // Validación básica
    if (!nombre || !sede || !origen) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Los campos nombre, sede y origen son requeridos'
      });
    }

    // Validar que la sede sea válida
    if (!['GUADALAJARA', 'CANCUN'].includes(sede.toUpperCase())) {
      return res.status(400).json({
        error: 'Sede inválida',
        message: 'La sede debe ser GUADALAJARA o CANCUN'
      });
    }

    // Validar esquemas si se proporcionan
    if (esquema && Array.isArray(esquema)) {
      for (const esquemaItem of esquema) {
        if (!esquemaItem.tipo_esquema || !esquemaItem.id_broker1) {
          return res.status(400).json({
            error: 'Datos incompletos',
            message: 'Cada esquema debe tener tipo_esquema e id_broker1'
          });
        }

        // Validar tipo de esquema
        const tiposValidos = ['FACTURA', 'SINDICATO', 'SAPI', 'C909', 'BANCARIZACION', 'CONTABILIDAD'];
        if (!tiposValidos.includes(esquemaItem.tipo_esquema.toUpperCase())) {
          return res.status(400).json({
            error: 'Tipo de esquema inválido',
            message: 'El tipo de esquema debe ser uno de: FACTURA, SINDICATO, SAPI, C909, BANCARIZACION, CONTABILIDAD'
          });
        }
      }
    }

    // Crear el cliente
    const nuevoCliente = await Cliente.create({
      nombre,
      sede,
      origen
    });

    // Crear los esquemas si se proporcionan
    let esquemasCreados = [];
    if (esquema && Array.isArray(esquema)) {
      const Esquema = require('../models/esquema.model');
      
      for (const esquemaItem of esquema) {
        const nuevoEsquema = await Esquema.create({
          id_cliente: nuevoCliente.id,
          tipo_esquema: esquemaItem.tipo_esquema.toUpperCase(),
          porcentaje_esquema: esquemaItem.porcentaje_esquema || null,
          costo: esquemaItem.costo || 'TOTAL',
          id_broker1: esquemaItem.id_broker1,
          porcentaje_broker1: esquemaItem.porcentaje1 || null,
          id_broker2: esquemaItem.id_broker2 || null,
          porcentaje_broker2: esquemaItem.porcentaje2 || null,
          id_broker3: esquemaItem.id_broker3 || null,
          porcentaje_broker3: esquemaItem.porcentaje3 || null
        });
        esquemasCreados.push(nuevoEsquema);
      }
    }

    // Devolver respuesta con cliente y esquemas
    res.status(201).json({
      cliente: nuevoCliente,
      esquemas: esquemasCreados
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el cliente'
    });
  }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
  try {
    const { 
      nombre, 
      sede, 
      esquema,
      origen
    } = req.body;
    const id = req.params.id;

    // Validación básica
    if (!nombre || !sede || !origen) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Los campos nombre, sede y origen son requeridos'
      });
    }

    // Validar que la sede sea válida
    if (!['GUADALAJARA', 'CANCUN'].includes(sede.toUpperCase())) {
      return res.status(400).json({
        error: 'Sede inválida',
        message: 'La sede debe ser GUADALAJARA o CANCUN'
      });
    }

    // Validar esquemas si se proporcionan
    if (esquema && Array.isArray(esquema)) {
      for (const esquemaItem of esquema) {
        if (!esquemaItem.tipo_esquema || !esquemaItem.id_broker1) {
          return res.status(400).json({
            error: 'Datos incompletos',
            message: 'Cada esquema debe tener tipo_esquema e id_broker1'
          });
        }

        // Validar tipo de esquema
        const tiposValidos = ['FACTURA', 'SINDICATO', 'SAPI', 'C909', 'BANCARIZACION', 'CONTABILIDAD'];
        if (!tiposValidos.includes(esquemaItem.tipo_esquema.toUpperCase())) {
          return res.status(400).json({
            error: 'Tipo de esquema inválido',
            message: 'El tipo de esquema debe ser uno de: FACTURA, SINDICATO, SAPI, C909, BANCARIZACION, CONTABILIDAD'
          });
        }

        // Validar costo si se proporciona
        if (esquemaItem.costo && !['TOTAL', 'SUBTOTAL'].includes(esquemaItem.costo.toUpperCase())) {
          return res.status(400).json({
            error: 'Costo inválido',
            message: 'El costo debe ser TOTAL o SUBTOTAL'
          });
        }
      }
    }

    // Validar unicidad de código si se proporciona en el body
    if (req.body.codigo) {
      const clienteConCodigo = await Cliente.findByCodigo(req.body.codigo);
      if (clienteConCodigo && clienteConCodigo.id != id) {
        return res.status(400).json({
          error: 'Código duplicado',
          message: 'Ya existe un cliente con ese código'
        });
      }
    }

    // Verificar si el cliente existe
    const existingCliente = await Cliente.findById(id);
    if (!existingCliente) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Cliente no encontrado'
      });
    }

    const actualizado = await Cliente.update(id, {
      nombre,
      sede,
      origen
    });

    if (!actualizado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Cliente no encontrado'
      });
    }

    // Manejar esquemas si se proporcionan
    let esquemasActualizados = [];
    if (esquema && Array.isArray(esquema)) {
      const Esquema = require('../models/esquema.model');
      
      // Obtener esquemas existentes del cliente
      const esquemasExistentes = await Esquema.findByClienteId(id);
      const esquemasExistentesMap = new Map();
      esquemasExistentes.forEach(esq => {
        esquemasExistentesMap.set(esq.tipo_esquema, esq);
      });
      
      // Procesar cada esquema del request
      for (const esquemaItem of esquema) {
        const tipoEsquema = esquemaItem.tipo_esquema.toUpperCase();
        const esquemaExistente = esquemasExistentesMap.get(tipoEsquema);
        
        const datosEsquema = {
          id_cliente: id,
          tipo_esquema: tipoEsquema,
          porcentaje_esquema: esquemaItem.porcentaje_esquema || null,
          costo: esquemaItem.costo || 'TOTAL',
          id_broker1: esquemaItem.id_broker1,
          porcentaje_broker1: esquemaItem.porcentaje1 || null,
          id_broker2: esquemaItem.id_broker2 || null,
          porcentaje_broker2: esquemaItem.porcentaje2 || null,
          id_broker3: esquemaItem.id_broker3 || null,
          porcentaje_broker3: esquemaItem.porcentaje3 || null
        };
        
        if (esquemaExistente) {
          // Actualizar esquema existente
          await Esquema.update(esquemaExistente.id, datosEsquema);
          esquemasActualizados.push({ ...datosEsquema, id: esquemaExistente.id });
        } else {
          // Crear nuevo esquema
          const nuevoEsquema = await Esquema.create(datosEsquema);
          esquemasActualizados.push(nuevoEsquema);
        }
      }
      
      // Eliminar esquemas que ya no están en el request
      const tiposEnRequest = new Set(esquema.map(esq => esq.tipo_esquema.toUpperCase()));
      for (const esquemaExistente of esquemasExistentes) {
        if (!tiposEnRequest.has(esquemaExistente.tipo_esquema)) {
          await Esquema.delete(esquemaExistente.id);
        }
      }
    }

    // Obtener el cliente actualizado con esquemas
    const clienteActualizado = await Cliente.findById(id);
    res.json({
      message: 'Cliente actualizado exitosamente',
      cliente: clienteActualizado
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el cliente'
    });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  try {
    const eliminado = await Cliente.delete(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      message: 'Cliente eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el cliente'
    });
  }
};

// Buscar clientes por letra
exports.getClientesByLetter = async (req, res) => {
  try {
    const { letter } = req.params;

    if (!letter || letter.length !== 1) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Debe proporcionar una sola letra'
      });
    }

    if (!/^[A-Za-z]$/.test(letter)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Debe proporcionar una letra válida (A-Z)'
      });
    }

    const clientes = await Cliente.findByLetter(letter);
    res.json(clientes);
  } catch (error) {
    console.error('Error al buscar clientes por letra:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron buscar los clientes por letra'
    });
  }
}; 
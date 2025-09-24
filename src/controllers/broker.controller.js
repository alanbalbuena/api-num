const Broker = require('../models/broker.model');

// Obtener todos los brokers
exports.getAllBrokers = async (req, res) => {
  try {
    const { search, q } = req.query;
    const searchTerm = search || q;
    
    // Si hay un término de búsqueda, usar la búsqueda con saldo
    if (searchTerm) {
      const brokers = await Broker.searchByNameWithSaldo(searchTerm);
      return res.json(brokers);
    }
    
    // Si no hay búsqueda, obtener todos los brokers con saldo
    const brokers = await Broker.findAllWithSaldo();
    res.json(brokers);
  } catch (error) {
    console.error('Error al obtener brokers:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los brokers'
    });
  }
};

// Obtener brokers activos
exports.getActiveBrokers = async (req, res) => {
  try {
    const brokers = await Broker.findActive();
    res.json(brokers);
  } catch (error) {
    console.error('Error al obtener brokers activos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los brokers activos'
    });
  }
};

// Obtener un broker por ID
exports.getBrokerById = async (req, res) => {
  try {
    const { id } = req.params;
    const broker = await Broker.findByIdWithSaldo(id);
    
    if (!broker) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Broker no encontrado'
      });
    }
    
    res.json(broker);
  } catch (error) {
    console.error('Error al obtener broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el broker'
    });
  }
};

// Crear un nuevo broker
exports.createBroker = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'El nombre es un campo obligatorio'
      });
    }
    
    const nuevoBroker = await Broker.create({ nombre });
    
    res.status(201).json(nuevoBroker);
  } catch (error) {
    console.error('Error al crear broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el broker'
    });
  }
};

// Actualizar un broker
exports.updateBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    
    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'El nombre es un campo obligatorio'
      });
    }
    
    // Verificar si el broker existe
    const existingBroker = await Broker.findById(id);
    if (!existingBroker) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Broker no encontrado'
      });
    }
    
    const updated = await Broker.update(id, { nombre });
    
    if (updated) {
      const brokerActualizado = await Broker.findById(id);
      res.json({
        message: 'Broker actualizado exitosamente',
        broker: brokerActualizado
      });
    } else {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al actualizar el broker'
      });
    }
  } catch (error) {
    console.error('Error al actualizar broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el broker'
    });
  }
};

// Eliminar un broker
exports.deleteBroker = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el broker existe
    const existingBroker = await Broker.findById(id);
    if (!existingBroker) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Broker no encontrado'
      });
    }
    
    const deleted = await Broker.delete(id);
    
    if (deleted) {
      res.json({
        message: 'Broker eliminado exitosamente'
      });
    } else {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al eliminar el broker'
      });
    }
  } catch (error) {
    console.error('Error al eliminar broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el broker'
    });
  }
};

// Buscar brokers por letra
exports.getBrokersByLetter = async (req, res) => {
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
        message: 'Debe proporcionar una letra válida'
      });
    }

    const brokers = await Broker.findByLetterWithSaldo(letter);
    res.json(brokers);
  } catch (error) {
    console.error('Error al obtener brokers por letra:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los brokers'
    });
  }
};

// Obtener brokers por rango de porcentaje
exports.getBrokersByPorcentajeRange = async (req, res) => {
  try {
    const { min, max } = req.query;

    if (!min || !max) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Debe proporcionar los valores mínimo y máximo'
      });
    }

    const minPorcentaje = parseFloat(min);
    const maxPorcentaje = parseFloat(max);

    if (isNaN(minPorcentaje) || isNaN(maxPorcentaje)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Los valores mínimo y máximo deben ser números válidos'
      });
    }

    if (minPorcentaje > maxPorcentaje) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'El valor mínimo no puede ser mayor al valor máximo'
      });
    }

    const brokers = await Broker.findByPorcentajeRange(minPorcentaje, maxPorcentaje);
    res.json(brokers);
  } catch (error) {
    console.error('Error al obtener brokers por rango de porcentaje:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los brokers'
    });
  }
}; 
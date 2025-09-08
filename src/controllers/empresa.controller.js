const Empresa = require('../models/empresa.model');

// Obtener todas las empresas
exports.getAllEmpresas = async (req, res) => {
  try {
    const { search, q } = req.query;
    const searchTerm = search || q;
    const empresas = await Empresa.findAll(searchTerm);
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las empresas'
    });
  }
};

// Obtener una empresa por ID
exports.getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    
    if (!empresa) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Empresa no encontrada'
      });
    }
    
    res.json(empresa);
  } catch (error) {
    console.error('Error al obtener empresa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la empresa'
    });
  }
};

// Obtener una empresa por RFC
exports.getEmpresaByRfc = async (req, res) => {
  try {
    const { rfc } = req.params;
    const empresa = await Empresa.findByRfc(rfc);
    
    if (!empresa) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Empresa no encontrada'
      });
    }
    
    res.json(empresa);
  } catch (error) {
    console.error('Error al obtener empresa por RFC:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la empresa'
    });
  }
};

// Crear una nueva empresa
exports.createEmpresa = async (req, res) => {
  try {
    const { nombre, rfc, giro, destino } = req.body;
    
    // Validaciones básicas
    if (!nombre || !rfc) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Nombre y RFC son campos obligatorios'
      });
    }
    
    // Verificar si ya existe una empresa con ese RFC
    const existingEmpresa = await Empresa.findByRfc(rfc);
    if (existingEmpresa) {
      return res.status(400).json({
        error: 'RFC duplicado',
        message: 'Ya existe una empresa con ese RFC'
      });
    }
    
    const nuevaEmpresa = await Empresa.create({
      nombre,
      rfc,
      giro,
      destino
    });
    
    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear la empresa'
    });
  }
};

// Actualizar una empresa
exports.updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rfc, giro, destino } = req.body;
    
    // Validaciones básicas
    if (!nombre || !rfc) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Nombre y RFC son campos obligatorios'
      });
    }
    
    // Verificar si la empresa existe
    const existingEmpresa = await Empresa.findById(id);
    if (!existingEmpresa) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Empresa no encontrada'
      });
    }
    
    // Verificar si el RFC ya existe en otra empresa
    const empresaConRfc = await Empresa.findByRfc(rfc);
    if (empresaConRfc && empresaConRfc.id !== parseInt(id)) {
      return res.status(400).json({
        error: 'RFC duplicado',
        message: 'Ya existe otra empresa con ese RFC'
      });
    }
    
    const updated = await Empresa.update(id, {
      nombre,
      rfc,
      giro,
      destino
    });
    
    if (updated) {
      const empresaActualizada = await Empresa.findById(id);
      res.json({
        message: 'Empresa actualizada exitosamente',
        empresa: empresaActualizada
      });
    } else {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al actualizar la empresa'
      });
    }
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la empresa'
    });
  }
};

// Eliminar una empresa
exports.deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la empresa existe
    const existingEmpresa = await Empresa.findById(id);
    if (!existingEmpresa) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Empresa no encontrada'
      });
    }
    
    const deleted = await Empresa.delete(id);
    
    if (deleted) {
      res.json({
        message: 'Empresa eliminada exitosamente'
      });
    } else {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al eliminar la empresa'
      });
    }
  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la empresa'
    });
  }
}; 
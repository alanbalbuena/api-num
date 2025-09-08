const { body, validationResult } = require('express-validator');
const Banco = require('../models/banco.model');

// Validaciones para crear/actualizar banco
const bancoValidation = [
  body('nombre_banco').notEmpty().withMessage('El nombre del banco es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre del banco debe tener entre 2 y 100 caracteres'),
  body('numero_cuenta').optional({ nullable: true, checkFalsy: true })
    .if(body('numero_cuenta').notEmpty())
    .isLength({ min: 10, max: 20 }).withMessage('El número de cuenta debe tener entre 10 y 20 caracteres')
    .matches(/^\d+$/).withMessage('El número de cuenta debe contener solo números'),
  body('clabe_interbancaria').optional({ nullable: true, checkFalsy: true })
    .if(body('clabe_interbancaria').notEmpty())
    .isLength({ min: 18, max: 18 }).withMessage('La CLABE debe tener exactamente 18 caracteres')
    .matches(/^\d{18}$/).withMessage('La CLABE debe contener solo números'),
  body('saldo_inicial').optional().isFloat({ min: 0 }).withMessage('El saldo inicial debe ser un número positivo'),
  body('id_empresa').notEmpty().withMessage('El ID de empresa es requerido')
    .isInt({ min: 1 }).withMessage('El ID de empresa debe ser un número entero positivo')
];

// Obtener todos los bancos
exports.getAllBancos = async (req, res) => {
  try {
    const { search, q, empresa } = req.query;
    const searchTerm = search || q;
    
    let bancos;
    if (empresa) {
      bancos = await Banco.findByEmpresa(empresa);
    } else {
      bancos = await Banco.findAll(searchTerm);
    }
    
    res.json(bancos);
  } catch (error) {
    console.error('Error al obtener bancos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los bancos'
    });
  }
};

// Obtener un banco por ID
exports.getBancoById = async (req, res) => {
  try {
    const banco = await Banco.findById(req.params.id);
    if (!banco) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Banco no encontrado'
      });
    }
    res.json(banco);
  } catch (error) {
    console.error('Error al obtener banco:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el banco'
    });
  }
};

// Obtener banco por CLABE
exports.getBancoByClabe = async (req, res) => {
  try {
    const banco = await Banco.findByClabe(req.params.clabe);
    if (!banco) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Banco no encontrado'
      });
    }
    res.json(banco);
  } catch (error) {
    console.error('Error al obtener banco por CLABE:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el banco'
    });
  }
};

// Obtener bancos por empresa
exports.getBancosByEmpresa = async (req, res) => {
  try {
    const bancos = await Banco.findByEmpresa(req.params.empresaId);
    res.json(bancos);
  } catch (error) {
    console.error('Error al obtener bancos por empresa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los bancos'
    });
  }
};

// Obtener estadísticas de bancos
exports.getBancoStats = async (req, res) => {
  try {
    const stats = await Banco.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
};

// Crear un nuevo banco
exports.createBanco = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { 
      nombre_banco, 
      numero_cuenta, 
      clabe_interbancaria, 
      saldo_inicial, 
      id_empresa 
    } = req.body;

    // Verificar si ya existe un banco con la misma CLABE (solo si se proporciona)
    if (clabe_interbancaria) {
      const existeClabe = await Banco.existsByClabe(clabe_interbancaria);
      if (existeClabe) {
        return res.status(400).json({
          error: 'CLABE duplicada',
          message: 'Ya existe un banco con esa CLABE interbancaria'
        });
      }
    }

    // Verificar si ya existe un banco con el mismo número de cuenta (solo si se proporciona)
    if (numero_cuenta) {
      const existeNumeroCuenta = await Banco.existsByNumeroCuenta(numero_cuenta);
      if (existeNumeroCuenta) {
        return res.status(400).json({
          error: 'Número de cuenta duplicado',
          message: 'Ya existe un banco con ese número de cuenta'
        });
      }
    }

    const nuevoBanco = await Banco.create({
      nombre_banco,
      numero_cuenta,
      clabe_interbancaria,
      saldo_inicial: saldo_inicial || 0,
      id_empresa
    });

    res.status(201).json(nuevoBanco);
  } catch (error) {
    console.error('Error al crear banco:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el banco'
    });
  }
};

// Actualizar un banco
exports.updateBanco = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { 
      nombre_banco, 
      numero_cuenta, 
      clabe_interbancaria, 
      saldo_inicial, 
      id_empresa 
    } = req.body;
    const id = req.params.id;

    // Verificar si el banco existe
    const bancoExistente = await Banco.findById(id);
    if (!bancoExistente) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Banco no encontrado'
      });
    }

    // Verificar si ya existe otro banco con la misma CLABE (solo si se proporciona)
    if (clabe_interbancaria) {
      const existeClabe = await Banco.existsByClabe(clabe_interbancaria, id);
      if (existeClabe) {
        return res.status(400).json({
          error: 'CLABE duplicada',
          message: 'Ya existe otro banco con esa CLABE interbancaria'
        });
      }
    }

    // Verificar si ya existe otro banco con el mismo número de cuenta (solo si se proporciona)
    if (numero_cuenta) {
      const existeNumeroCuenta = await Banco.existsByNumeroCuenta(numero_cuenta, id);
      if (existeNumeroCuenta) {
        return res.status(400).json({
          error: 'Número de cuenta duplicado',
          message: 'Ya existe otro banco con ese número de cuenta'
        });
      }
    }

    const actualizado = await Banco.update(id, {
      nombre_banco,
      numero_cuenta,
      clabe_interbancaria,
      saldo_inicial: saldo_inicial || 0,
      id_empresa
    });

    if (!actualizado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar el banco'
      });
    }

    // Obtener el banco actualizado
    const bancoActualizado = await Banco.findById(id);

    res.json({
      message: 'Banco actualizado exitosamente',
      banco: bancoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar banco:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el banco'
    });
  }
};

// Eliminar un banco
exports.deleteBanco = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar si el banco existe
    const bancoExistente = await Banco.findById(id);
    if (!bancoExistente) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Banco no encontrado'
      });
    }

    const eliminado = await Banco.delete(id);
    
    if (!eliminado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el banco'
      });
    }

    res.json({
      message: 'Banco eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar banco:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el banco'
    });
  }
};

// Buscar bancos por nombre
exports.searchBancosByNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    const bancos = await Banco.findByNombreBanco(nombre);
    res.json(bancos);
  } catch (error) {
    console.error('Error al buscar bancos por nombre:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron buscar los bancos'
    });
  }
};

module.exports = {
  getAllBancos: exports.getAllBancos,
  getBancoById: exports.getBancoById,
  getBancoByClabe: exports.getBancoByClabe,
  getBancosByEmpresa: exports.getBancosByEmpresa,
  getBancoStats: exports.getBancoStats,
  createBanco: exports.createBanco,
  updateBanco: exports.updateBanco,
  deleteBanco: exports.deleteBanco,
  searchBancosByNombre: exports.searchBancosByNombre,
  bancoValidation
}; 
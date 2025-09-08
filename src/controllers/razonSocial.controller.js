const RazonSocial = require('../models/razonSocial.model');

class RazonSocialController {
  // Crear una nueva razón social
  static async create(req, res) {
    try {
      const {
        id_cliente,
        razon_social,
        rfc,
        regimen_fiscal,
        calle,
        numero_interior,
        numero_exterior,
        colonia,
        codigo_postal,
        ciudad,
        estado,
        forma_pago,
        metodo_pago,
        uso_cfdi
      } = req.body;

      // Validaciones básicas
      if (!id_cliente || !razon_social || !rfc || !regimen_fiscal || !calle || 
          !numero_exterior || !colonia || !codigo_postal || !ciudad || !estado) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos obligatorios deben estar presentes'
        });
      }

      // Validar formato de RFC (básico)
      if (rfc.length < 12 || rfc.length > 13) {
        return res.status(400).json({
          success: false,
          message: 'El RFC debe tener entre 12 y 13 caracteres'
        });
      }

      const razonSocialData = {
        id_cliente,
        razon_social,
        rfc: rfc.toUpperCase(),
        regimen_fiscal,
        calle,
        numero_interior: numero_interior || null,
        numero_exterior,
        colonia,
        codigo_postal,
        ciudad,
        estado,
        forma_pago: forma_pago || null,
        metodo_pago: metodo_pago || null,
        uso_cfdi: uso_cfdi || null
      };

      const nuevaRazonSocial = await RazonSocial.create(razonSocialData);
      
      res.status(201).json({
        success: true,
        message: 'Razón social creada exitosamente',
        data: nuevaRazonSocial
      });
    } catch (error) {
      console.error('Error al crear razón social:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener todas las razones sociales
  static async getAll(req, res) {
    try {
      const razonesSociales = await RazonSocial.findAll();
      
      res.status(200).json({
        success: true,
        data: razonesSociales
      });
    } catch (error) {
      console.error('Error al obtener razones sociales:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener razón social por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const razonSocial = await RazonSocial.findById(id);
      
      if (!razonSocial) {
        return res.status(404).json({
          success: false,
          message: 'Razón social no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: razonSocial
      });
    } catch (error) {
      console.error('Error al obtener razón social:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener razones sociales por cliente
  static async getByClienteId(req, res) {
    try {
      const { clienteId } = req.params;
      const razonesSociales = await RazonSocial.findByClienteId(clienteId);
      
      res.status(200).json({
        success: true,
        data: razonesSociales
      });
    } catch (error) {
      console.error('Error al obtener razones sociales del cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Buscar por RFC
  static async getByRfc(req, res) {
    try {
      const { rfc } = req.params;
      const razonSocial = await RazonSocial.findByRfc(rfc);
      
      if (!razonSocial) {
        return res.status(404).json({
          success: false,
          message: 'Razón social no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: razonSocial
      });
    } catch (error) {
      console.error('Error al buscar razón social por RFC:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener razón social por ID con sus esquemas
  static async getByIdWithEsquemas(req, res) {
    try {
      const { id } = req.params;
      const razonSocial = await RazonSocial.findByIdWithEsquemas(id);
      
      if (!razonSocial) {
        return res.status(404).json({
          success: false,
          message: 'Razón social no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: razonSocial
      });
    } catch (error) {
      console.error('Error al obtener razón social con esquemas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener todas las razones sociales con sus esquemas
  static async getAllWithEsquemas(req, res) {
    try {
      const razonesSociales = await RazonSocial.findAllWithEsquemas();
      
      res.status(200).json({
        success: true,
        data: razonesSociales
      });
    } catch (error) {
      console.error('Error al obtener razones sociales con esquemas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar razón social
  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        id_cliente,
        razon_social,
        rfc,
        regimen_fiscal,
        calle,
        numero_interior,
        numero_exterior,
        colonia,
        codigo_postal,
        ciudad,
        estado,
        forma_pago,
        metodo_pago,
        uso_cfdi
      } = req.body;

      // Validaciones básicas
      if (!id_cliente || !razon_social || !rfc || !regimen_fiscal || !calle || 
          !numero_exterior || !colonia || !codigo_postal || !ciudad || !estado) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos obligatorios deben estar presentes'
        });
      }

      // Verificar que la razón social existe
      const razonSocialExistente = await RazonSocial.findById(id);
      if (!razonSocialExistente) {
        return res.status(404).json({
          success: false,
          message: 'Razón social no encontrada'
        });
      }

      const razonSocialData = {
        id_cliente,
        razon_social,
        rfc: rfc.toUpperCase(),
        regimen_fiscal,
        calle,
        numero_interior: numero_interior || null,
        numero_exterior,
        colonia,
        codigo_postal,
        ciudad,
        estado,
        forma_pago: forma_pago || null,
        metodo_pago: metodo_pago || null,
        uso_cfdi: uso_cfdi || null
      };

      const actualizado = await RazonSocial.update(id, razonSocialData);
      
      if (actualizado) {
        const razonSocialActualizada = await RazonSocial.findById(id);
        res.status(200).json({
          success: true,
          message: 'Razón social actualizada exitosamente',
          data: razonSocialActualizada
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No se pudo actualizar la razón social'
        });
      }
    } catch (error) {
      console.error('Error al actualizar razón social:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Eliminar razón social
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar que la razón social existe
      const razonSocialExistente = await RazonSocial.findById(id);
      if (!razonSocialExistente) {
        return res.status(404).json({
          success: false,
          message: 'Razón social no encontrada'
        });
      }

      const eliminado = await RazonSocial.delete(id);
      
      if (eliminado) {
        res.status(200).json({
          success: true,
          message: 'Razón social eliminada exitosamente'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No se pudo eliminar la razón social'
        });
      }
    } catch (error) {
      console.error('Error al eliminar razón social:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = RazonSocialController;

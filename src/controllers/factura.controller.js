const Factura = require('../models/factura.model');
const Empresa = require('../models/empresa.model');

// Obtener todas las facturas con filtros y paginación
const getAllFacturas = async (req, res) => {
    try {
        const { 
            limit = 50, 
            offset = 0, 
            id_empresa, 
            receptor, 
            rfc, 
            folio, 
            uuid, 
            tipo_comprobante, 
            estado, 
            fecha_desde, 
            fecha_hasta
        } = req.query;

        const filters = {
            id_empresa: id_empresa ? parseInt(id_empresa) : null,
            receptor,
            rfc,
            folio,
            uuid,
            tipo_comprobante,
            estado,
            fecha_desde,
            fecha_hasta
        };

        // Remover filtros null
        Object.keys(filters).forEach(key => {
            if (filters[key] === null || filters[key] === undefined) {
                delete filters[key];
            }
        });

        const facturas = await Factura.getAll(parseInt(limit), parseInt(offset), filters);
        const total = await Factura.count(filters);

        res.status(200).json({
            success: true,
            data: facturas,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener factura por ID
const getFacturaById = async (req, res) => {
    try {
        const { id } = req.params;
        const factura = await Factura.getById(id);

        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: factura
        });
    } catch (error) {
        console.error('Error al obtener factura:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener factura por UUID
const getFacturaByUuid = async (req, res) => {
    try {
        const { uuid } = req.params;
        const factura = await Factura.getByUuid(uuid);

        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: factura
        });
    } catch (error) {
        console.error('Error al obtener factura por UUID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener factura por folio
const getFacturaByFolio = async (req, res) => {
    try {
        const { folio } = req.params;
        const factura = await Factura.getByFolio(folio);

        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: factura
        });
    } catch (error) {
        console.error('Error al obtener factura por folio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nueva factura
const createFactura = async (req, res) => {
    try {
        const {
            id_empresa,
            receptor,
            rfc,
            folio,
            uuid,
            tipo_comprobante,
            estado,
            fecha_emision,
            metodo_pago,
            forma_pago,
            subtotal,
            total,
            iva
        } = req.body;

        // Validaciones básicas
        if (!id_empresa || !receptor || !rfc || !folio || !tipo_comprobante || 
            !fecha_emision || !metodo_pago || !forma_pago || !subtotal || !total) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        // Validar RFC (formato básico)
        const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
        if (!rfcRegex.test(rfc)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de RFC inválido'
            });
        }

        // Verificar si ya existe una factura con el mismo folio
        const folioExists = await Factura.existsByFolio(folio);
        if (folioExists) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una factura con este folio'
            });
        }

        // Verificar si ya existe una factura con el mismo UUID (si se proporciona)
        if (uuid) {
            const uuidExists = await Factura.existsByUuid(uuid);
            if (uuidExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una factura con este UUID'
                });
            }
        }

        // Validar que el total sea igual al subtotal + IVA
        const calculatedTotal = parseFloat(subtotal) + parseFloat(iva || 0);
        if (Math.abs(calculatedTotal - parseFloat(total)) > 0.01) {
            return res.status(400).json({
                success: false,
                message: 'El total debe ser igual al subtotal + IVA'
            });
        }

        // Verificar que la empresa existe
        const empresa = await Empresa.getById(parseInt(id_empresa));
        if (!empresa) {
            return res.status(400).json({
                success: false,
                message: 'La empresa especificada no existe'
            });
        }

        const facturaData = {
            id_empresa: parseInt(id_empresa),
            receptor,
            rfc: rfc.toUpperCase(),
            folio,
            uuid,
            tipo_comprobante,
            estado: estado || 'PENDIENTE',
            fecha_emision,
            metodo_pago,
            forma_pago,
            subtotal: parseFloat(subtotal),
            total: parseFloat(total),
            iva: parseFloat(iva || 0)
        };

        const nuevaFactura = await Factura.create(facturaData);

        res.status(201).json({
            success: true,
            message: 'Factura creada exitosamente',
            data: nuevaFactura
        });
    } catch (error) {
        console.error('Error al crear factura:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar factura
const updateFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Verificar si la factura existe
        const facturaExistente = await Factura.getById(id);
        if (!facturaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }

        // Validar RFC si se proporciona
        if (updateData.rfc) {
            const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
            if (!rfcRegex.test(updateData.rfc)) {
                return res.status(400).json({
                    success: false,
                    message: 'Formato de RFC inválido'
                });
            }
            updateData.rfc = updateData.rfc.toUpperCase();
        }

        // Verificar duplicados de folio
        if (updateData.folio) {
            const folioExists = await Factura.existsByFolio(updateData.folio, id);
            if (folioExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una factura con este folio'
                });
            }
        }

        // Verificar duplicados de UUID
        if (updateData.uuid) {
            const uuidExists = await Factura.existsByUuid(updateData.uuid, id);
            if (uuidExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una factura con este UUID'
                });
            }
        }

        // Validar total si se actualizan subtotal o IVA
        if (updateData.subtotal || updateData.iva !== undefined) {
            const subtotal = updateData.subtotal || facturaExistente.subtotal;
            const iva = updateData.iva !== undefined ? updateData.iva : facturaExistente.iva;
            const total = updateData.total || facturaExistente.total;
            
            const calculatedTotal = parseFloat(subtotal) + parseFloat(iva);
            if (Math.abs(calculatedTotal - parseFloat(total)) > 0.01) {
                return res.status(400).json({
                    success: false,
                    message: 'El total debe ser igual al subtotal + IVA'
                });
            }
        }

        // Convertir valores numéricos
        if (updateData.id_empresa) updateData.id_empresa = parseInt(updateData.id_empresa);
        if (updateData.subtotal) updateData.subtotal = parseFloat(updateData.subtotal);
        if (updateData.total) updateData.total = parseFloat(updateData.total);
        if (updateData.iva !== undefined) updateData.iva = parseFloat(updateData.iva);

        // Verificar que la empresa existe si se está actualizando
        if (updateData.id_empresa) {
            const empresa = await Empresa.getById(updateData.id_empresa);
            if (!empresa) {
                return res.status(400).json({
                    success: false,
                    message: 'La empresa especificada no existe'
                });
            }
        }

        const facturaActualizada = await Factura.update(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Factura actualizada exitosamente',
            data: facturaActualizada
        });
    } catch (error) {
        console.error('Error al actualizar factura:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar factura
const deleteFactura = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la factura existe
        const factura = await Factura.getById(id);
        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }

        // Verificar si la factura está pagada (opcional: prevenir eliminación de facturas pagadas)
        if (factura.estado === 'PAGADA') {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar una factura pagada'
            });
        }

        await Factura.delete(id);

        res.status(200).json({
            success: true,
            message: 'Factura eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar factura:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas de facturas
const getFacturasStats = async (req, res) => {
    try {
        const { id_empresa, fecha_desde, fecha_hasta } = req.query;

        const filters = {
            id_empresa: id_empresa ? parseInt(id_empresa) : null,
            fecha_desde,
            fecha_hasta
        };

        // Remover filtros null
        Object.keys(filters).forEach(key => {
            if (filters[key] === null || filters[key] === undefined) {
                delete filters[key];
            }
        });

        const stats = await Factura.getStats(filters);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener facturas por empresa
const getFacturasByEmpresa = async (req, res) => {
    try {
        const { id_empresa } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        const facturas = await Factura.getByEmpresa(
            parseInt(id_empresa), 
            parseInt(limit), 
            parseInt(offset)
        );

        res.status(200).json({
            success: true,
            data: facturas
        });
    } catch (error) {
        console.error('Error al obtener facturas por empresa:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};



module.exports = {
    getAllFacturas,
    getFacturaById,
    getFacturaByUuid,
    getFacturaByFolio,
    createFactura,
    updateFactura,
    deleteFactura,
    getFacturasStats,
    getFacturasByEmpresa
}; 
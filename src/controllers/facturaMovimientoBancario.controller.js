const FacturaMovimientoBancario = require('../models/facturaMovimientoBancario.model');
const Factura = require('../models/factura.model');
const MovimientoBancario = require('../models/movimientoBancario.model');

// Obtener todas las asignaciones con filtros y paginación
const getAllAsignaciones = async (req, res) => {
    try {
        const { 
            limit = 50, 
            offset = 0, 
            id_factura, 
            id_movimiento_bancario, 
            estado_factura, 
            fecha_desde, 
            fecha_hasta 
        } = req.query;

        const filters = {
            id_factura: id_factura ? parseInt(id_factura) : null,
            id_movimiento_bancario: id_movimiento_bancario ? parseInt(id_movimiento_bancario) : null,
            estado_factura,
            fecha_desde,
            fecha_hasta
        };

        // Remover filtros null
        Object.keys(filters).forEach(key => {
            if (filters[key] === null || filters[key] === undefined) {
                delete filters[key];
            }
        });

        const asignaciones = await FacturaMovimientoBancario.getAll(parseInt(limit), parseInt(offset), filters);
        const total = await FacturaMovimientoBancario.count(filters);

        res.status(200).json({
            success: true,
            data: asignaciones,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Asignar un movimiento bancario a una factura
const asignarMovimiento = async (req, res) => {
    try {
        const { id_factura, id_movimiento_bancario, monto_asignado } = req.body;

        // Validaciones básicas
        if (!id_factura || !id_movimiento_bancario || !monto_asignado) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: id_factura, id_movimiento_bancario, monto_asignado'
            });
        }

        // Verificar que la factura existe
        const factura = await Factura.getById(id_factura);
        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'La factura especificada no existe'
            });
        }

        // Verificar que el movimiento bancario existe
        const movimiento = await MovimientoBancario.getById(id_movimiento_bancario);
        if (!movimiento) {
            return res.status(404).json({
                success: false,
                message: 'El movimiento bancario especificado no existe'
            });
        }

        // Verificar que no existe ya la asignación
        const existeAsignacion = await FacturaMovimientoBancario.existeAsignacion(id_factura, id_movimiento_bancario);
        if (existeAsignacion) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una asignación entre esta factura y este movimiento bancario'
            });
        }

        // Validar que el monto asignado no exceda el total de la factura
        const totalAsignado = await FacturaMovimientoBancario.getTotalAsignadoByFactura(id_factura);
        const totalDisponible = factura.total - totalAsignado;
        
        if (monto_asignado > totalDisponible) {
            return res.status(400).json({
                success: false,
                message: `El monto asignado (${monto_asignado}) excede el saldo disponible de la factura (${totalDisponible})`
            });
        }

        // Validar que el monto asignado no exceda el monto del movimiento bancario
        const totalAsignadoMovimiento = await FacturaMovimientoBancario.getTotalAsignadoByMovimiento(id_movimiento_bancario);
        const saldoDisponibleMovimiento = movimiento.monto - totalAsignadoMovimiento;
        
        if (monto_asignado > saldoDisponibleMovimiento) {
            return res.status(400).json({
                success: false,
                message: `El monto asignado (${monto_asignado}) excede el saldo disponible del movimiento bancario (${saldoDisponibleMovimiento})`
            });
        }

        const asignacion = await FacturaMovimientoBancario.asignarMovimiento(
            parseInt(id_factura), 
            parseInt(id_movimiento_bancario), 
            parseFloat(monto_asignado)
        );

        res.status(201).json({
            success: true,
            message: 'Movimiento bancario asignado exitosamente a la factura',
            data: asignacion
        });
    } catch (error) {
        console.error('Error al asignar movimiento bancario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener movimientos bancarios de una factura
const getMovimientosByFactura = async (req, res) => {
    try {
        const { id_factura } = req.params;

        // Verificar que la factura existe
        const factura = await Factura.getById(id_factura);
        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'La factura especificada no existe'
            });
        }

        const movimientos = await FacturaMovimientoBancario.getMovimientosByFactura(parseInt(id_factura));
        const resumen = await FacturaMovimientoBancario.getResumenPagosByFactura(parseInt(id_factura));

        res.status(200).json({
            success: true,
            data: {
                factura: {
                    id: factura.id,
                    receptor: factura.receptor,
                    folio: factura.folio,
                    total: factura.total,
                    estado: factura.estado
                },
                resumen_pagos: resumen,
                movimientos: movimientos
            }
        });
    } catch (error) {
        console.error('Error al obtener movimientos de la factura:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener facturas de un movimiento bancario
const getFacturasByMovimiento = async (req, res) => {
    try {
        const { id_movimiento_bancario } = req.params;

        // Verificar que el movimiento bancario existe
        const movimiento = await MovimientoBancario.getById(id_movimiento_bancario);
        if (!movimiento) {
            return res.status(404).json({
                success: false,
                message: 'El movimiento bancario especificado no existe'
            });
        }

        const facturas = await FacturaMovimientoBancario.getFacturasByMovimiento(parseInt(id_movimiento_bancario));
        const resumen = await FacturaMovimientoBancario.getResumenAsignacionesByMovimiento(parseInt(id_movimiento_bancario));

        res.status(200).json({
            success: true,
            data: {
                movimiento: {
                    id: movimiento.id,
                    descripcion: movimiento.descripcion,
                    monto: movimiento.monto,
                    fecha: movimiento.fecha
                },
                resumen_asignaciones: resumen,
                facturas: facturas
            }
        });
    } catch (error) {
        console.error('Error al obtener facturas del movimiento bancario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener asignación específica
const getAsignacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const asignacion = await FacturaMovimientoBancario.getById(id);

        if (!asignacion) {
            return res.status(404).json({
                success: false,
                message: 'Asignación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: asignacion
        });
    } catch (error) {
        console.error('Error al obtener asignación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar monto asignado
const updateMontoAsignado = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto_asignado } = req.body;

        if (!monto_asignado) {
            return res.status(400).json({
                success: false,
                message: 'El monto asignado es requerido'
            });
        }

        // Verificar que la asignación existe
        const asignacionExistente = await FacturaMovimientoBancario.getById(id);
        if (!asignacionExistente) {
            return res.status(404).json({
                success: false,
                message: 'Asignación no encontrada'
            });
        }

        // Validar que el nuevo monto no exceda el total de la factura
        const totalAsignado = await FacturaMovimientoBancario.getTotalAsignadoByFactura(asignacionExistente.id_factura);
        const totalDisponible = asignacionExistente.total_factura - (totalAsignado - asignacionExistente.monto_asignado);
        
        if (monto_asignado > totalDisponible) {
            return res.status(400).json({
                success: false,
                message: `El monto asignado (${monto_asignado}) excede el saldo disponible de la factura (${totalDisponible})`
            });
        }

        // Validar que el nuevo monto no exceda el monto del movimiento bancario
        const totalAsignadoMovimiento = await FacturaMovimientoBancario.getTotalAsignadoByMovimiento(asignacionExistente.id_movimiento_bancario);
        const saldoDisponibleMovimiento = asignacionExistente.monto + (totalAsignadoMovimiento - asignacionExistente.monto_asignado);
        
        if (monto_asignado > saldoDisponibleMovimiento) {
            return res.status(400).json({
                success: false,
                message: `El monto asignado (${monto_asignado}) excede el saldo disponible del movimiento bancario (${saldoDisponibleMovimiento})`
            });
        }

        const asignacionActualizada = await FacturaMovimientoBancario.updateMonto(id, parseFloat(monto_asignado));

        res.status(200).json({
            success: true,
            message: 'Monto asignado actualizado exitosamente',
            data: asignacionActualizada
        });
    } catch (error) {
        console.error('Error al actualizar monto asignado:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar asignación
const eliminarAsignacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la asignación existe
        const asignacion = await FacturaMovimientoBancario.getById(id);
        if (!asignacion) {
            return res.status(404).json({
                success: false,
                message: 'Asignación no encontrada'
            });
        }

        await FacturaMovimientoBancario.eliminarAsignacion(id);

        res.status(200).json({
            success: true,
            message: 'Asignación eliminada exitosamente',
            data: asignacion
        });
    } catch (error) {
        console.error('Error al eliminar asignación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    getAllAsignaciones,
    asignarMovimiento,
    getMovimientosByFactura,
    getFacturasByMovimiento,
    getAsignacionById,
    updateMontoAsignado,
    eliminarAsignacion
}; 
const db = require('../config/database');

class FacturaMovimientoBancario {
    // Asignar un movimiento bancario a una factura
    static async asignarMovimiento(idFactura, idMovimientoBancario, montoAsignado) {
        const query = `
            INSERT INTO factura_movimiento_bancario (
                id_factura, id_movimiento_bancario, monto_asignado
            ) VALUES (?, ?, ?)
        `;
        
        const result = await db.query(query, [idFactura, idMovimientoBancario, montoAsignado]);
        return { id: result[0].insertId, id_factura: idFactura, id_movimiento_bancario: idMovimientoBancario, monto_asignado: montoAsignado };
    }

    // Obtener todos los movimientos bancarios de una factura
    static async getMovimientosByFactura(idFactura) {
        const query = `
            SELECT fmb.*, mb.descripcion, mb.monto, mb.fecha, mb.tipo, mb.id_banco, b.nombre as banco_nombre
            FROM factura_movimiento_bancario fmb
            LEFT JOIN movimientos_bancarios mb ON fmb.id_movimiento_bancario = mb.id
            LEFT JOIN bancos b ON mb.id_banco = b.id
            WHERE fmb.id_factura = ?
            ORDER BY fmb.fecha_asignacion DESC
        `;
        
        const result = await db.query(query, [idFactura]);
        return result[0];
    }

    // Obtener todas las facturas de un movimiento bancario
    static async getFacturasByMovimiento(idMovimientoBancario) {
        const query = `
            SELECT fmb.*, f.receptor, f.folio, f.total, f.estado, f.fecha_emision, e.nombre as empresa_nombre
            FROM factura_movimiento_bancario fmb
            LEFT JOIN facturas f ON fmb.id_factura = f.id
            LEFT JOIN empresa e ON f.id_empresa = e.id
            WHERE fmb.id_movimiento_bancario = ?
            ORDER BY fmb.fecha_asignacion DESC
        `;
        
        const result = await db.query(query, [idMovimientoBancario]);
        return result[0];
    }

    // Obtener asignación específica
    static async getById(id) {
        const query = `
            SELECT fmb.*, f.receptor, f.folio, f.total, mb.descripcion, mb.monto
            FROM factura_movimiento_bancario fmb
            LEFT JOIN facturas f ON fmb.id_factura = f.id
            LEFT JOIN movimientos_bancarios mb ON fmb.id_movimiento_bancario = mb.id
            WHERE fmb.id = ?
        `;
        
        const result = await db.query(query, [id]);
        return result[0][0];
    }

    // Actualizar monto asignado
    static async updateMonto(id, montoAsignado) {
        const query = `
            UPDATE factura_movimiento_bancario 
            SET monto_asignado = ?
            WHERE id = ?
        `;
        
        await db.query(query, [montoAsignado, id]);
        return this.getById(id);
    }

    // Eliminar asignación
    static async eliminarAsignacion(id) {
        const asignacion = await this.getById(id);
        const query = 'DELETE FROM factura_movimiento_bancario WHERE id = ?';
        await db.query(query, [id]);
        return asignacion;
    }

    // Verificar si ya existe la asignación
    static async existeAsignacion(idFactura, idMovimientoBancario) {
        const query = `
            SELECT id FROM factura_movimiento_bancario 
            WHERE id_factura = ? AND id_movimiento_bancario = ?
        `;
        
        const result = await db.query(query, [idFactura, idMovimientoBancario]);
        return result[0].length > 0;
    }

    // Obtener total asignado a una factura
    static async getTotalAsignadoByFactura(idFactura) {
        const query = `
            SELECT COALESCE(SUM(monto_asignado), 0) as total_asignado
            FROM factura_movimiento_bancario
            WHERE id_factura = ?
        `;
        
        const result = await db.query(query, [idFactura]);
        return parseFloat(result[0][0].total_asignado);
    }

    // Obtener total asignado de un movimiento bancario
    static async getTotalAsignadoByMovimiento(idMovimientoBancario) {
        const query = `
            SELECT COALESCE(SUM(monto_asignado), 0) as total_asignado
            FROM factura_movimiento_bancario
            WHERE id_movimiento_bancario = ?
        `;
        
        const result = await db.query(query, [idMovimientoBancario]);
        return parseFloat(result[0][0].total_asignado);
    }

    // Obtener resumen de pagos por factura
    static async getResumenPagosByFactura(idFactura) {
        const query = `
            SELECT 
                f.total as total_factura,
                COALESCE(SUM(fmb.monto_asignado), 0) as total_pagado,
                (f.total - COALESCE(SUM(fmb.monto_asignado), 0)) as saldo_pendiente,
                COUNT(fmb.id) as num_movimientos
            FROM facturas f
            LEFT JOIN factura_movimiento_bancario fmb ON f.id = fmb.id_factura
            WHERE f.id = ?
            GROUP BY f.id, f.total
        `;
        
        const result = await db.query(query, [idFactura]);
        return result[0][0];
    }

    // Obtener resumen de asignaciones por movimiento bancario
    static async getResumenAsignacionesByMovimiento(idMovimientoBancario) {
        const query = `
            SELECT 
                mb.monto as total_movimiento,
                COALESCE(SUM(fmb.monto_asignado), 0) as total_asignado,
                (mb.monto - COALESCE(SUM(fmb.monto_asignado), 0)) as saldo_disponible,
                COUNT(fmb.id) as num_facturas
            FROM movimientos_bancarios mb
            LEFT JOIN factura_movimiento_bancario fmb ON mb.id = fmb.id_movimiento_bancario
            WHERE mb.id = ?
            GROUP BY mb.id, mb.monto
        `;
        
        const result = await db.query(query, [idMovimientoBancario]);
        return result[0][0];
    }

    // Obtener todas las asignaciones con filtros
    static async getAll(limit = 50, offset = 0, filters = {}) {
        let query = `
            SELECT fmb.*, 
                   f.receptor, f.folio, f.total as total_factura, f.estado,
                   mb.descripcion, mb.monto as monto_movimiento, mb.fecha as fecha_movimiento,
                   e.nombre as empresa_nombre, b.nombre as banco_nombre
            FROM factura_movimiento_bancario fmb
            LEFT JOIN facturas f ON fmb.id_factura = f.id
            LEFT JOIN movimientos_bancarios mb ON fmb.id_movimiento_bancario = mb.id
            LEFT JOIN empresa e ON f.id_empresa = e.id
            LEFT JOIN bancos b ON mb.id_banco = b.id
            WHERE 1=1
        `;
        
        const params = [];

        // Aplicar filtros
        if (filters.id_factura) {
            query += ` AND fmb.id_factura = ?`;
            params.push(filters.id_factura);
        }

        if (filters.id_movimiento_bancario) {
            query += ` AND fmb.id_movimiento_bancario = ?`;
            params.push(filters.id_movimiento_bancario);
        }

        if (filters.estado_factura) {
            query += ` AND f.estado = ?`;
            params.push(filters.estado_factura);
        }

        if (filters.fecha_desde) {
            query += ` AND fmb.fecha_asignacion >= ?`;
            params.push(filters.fecha_desde);
        }

        if (filters.fecha_hasta) {
            query += ` AND fmb.fecha_asignacion <= ?`;
            params.push(filters.fecha_hasta);
        }

        // Ordenar por fecha de asignación descendente
        query += ` ORDER BY fmb.fecha_asignacion DESC`;

        // Aplicar límite y offset
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result[0];
    }

    // Contar total de asignaciones
    static async count(filters = {}) {
        let query = `
            SELECT COUNT(*) as count
            FROM factura_movimiento_bancario fmb
            LEFT JOIN facturas f ON fmb.id_factura = f.id
            WHERE 1=1
        `;
        
        const params = [];

        // Aplicar filtros
        if (filters.id_factura) {
            query += ` AND fmb.id_factura = ?`;
            params.push(filters.id_factura);
        }

        if (filters.id_movimiento_bancario) {
            query += ` AND fmb.id_movimiento_bancario = ?`;
            params.push(filters.id_movimiento_bancario);
        }

        if (filters.estado_factura) {
            query += ` AND f.estado = ?`;
            params.push(filters.estado_factura);
        }

        if (filters.fecha_desde) {
            query += ` AND fmb.fecha_asignacion >= ?`;
            params.push(filters.fecha_desde);
        }

        if (filters.fecha_hasta) {
            query += ` AND fmb.fecha_asignacion <= ?`;
            params.push(filters.fecha_hasta);
        }

        const result = await db.query(query, params);
        return parseInt(result[0][0].count);
    }
}

module.exports = FacturaMovimientoBancario; 
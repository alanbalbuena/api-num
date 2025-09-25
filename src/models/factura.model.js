const db = require('../config/database');

class Factura {
    // Obtener todas las facturas
    static async getAll(limit = 50, offset = 0, filters = {}) {
        let query = `
            SELECT f.*, e.nombre as empresa_nombre
            FROM facturas f
            LEFT JOIN empresa e ON f.id_empresa = e.id
            WHERE 1=1
        `;
        
        const params = [];

        // Aplicar filtros
        if (filters.id_empresa) {
            query += ` AND f.id_empresa = ?`;
            params.push(filters.id_empresa);
        }

        if (filters.receptor) {
            query += ` AND f.receptor LIKE ?`;
            params.push(`%${filters.receptor}%`);
        }

        if (filters.rfc) {
            query += ` AND f.rfc LIKE ?`;
            params.push(`%${filters.rfc}%`);
        }

        if (filters.folio) {
            query += ` AND f.folio LIKE ?`;
            params.push(`%${filters.folio}%`);
        }

        if (filters.uuid) {
            query += ` AND f.uuid LIKE ?`;
            params.push(`%${filters.uuid}%`);
        }

        if (filters.tipo_comprobante) {
            query += ` AND f.tipo_comprobante = ?`;
            params.push(filters.tipo_comprobante);
        }

        if (filters.estado) {
            query += ` AND f.estado = ?`;
            params.push(filters.estado);
        }

        if (filters.fecha_desde) {
            query += ` AND f.fecha_emision >= ?`;
            params.push(filters.fecha_desde);
        }

        if (filters.fecha_hasta) {
            query += ` AND f.fecha_emision <= ?`;
            params.push(filters.fecha_hasta);
        }

        // Ordenar por fecha de emisión descendente
        query += ` ORDER BY f.fecha_emision DESC, f.id DESC`;

        // Aplicar límite y offset
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result[0];
    }

    // Obtener factura por ID
    static async getById(id) {
        const query = `
            SELECT f.*, e.nombre as empresa_nombre
            FROM facturas f
            LEFT JOIN empresa e ON f.id_empresa = e.id
            WHERE f.id = ?
        `;
        const result = await db.query(query, [id]);
        return result[0][0];
    }

    // Obtener factura por UUID
    static async getByUuid(uuid) {
        const query = `
            SELECT f.*, e.nombre as empresa_nombre
            FROM facturas f
            LEFT JOIN empresa e ON f.id_empresa = e.id
            WHERE f.uuid = ?
        `;
        const result = await db.query(query, [uuid]);
        return result[0][0];
    }

    // Obtener factura por folio
    static async getByFolio(folio) {
        const query = `
            SELECT f.*, e.nombre as empresa_nombre
            FROM facturas f
            LEFT JOIN empresa e ON f.id_empresa = e.id
            WHERE f.folio = ?
        `;
        const result = await db.query(query, [folio]);
        return result[0][0];
    }

    // Crear nueva factura
    static async create(facturaData) {
        const query = `
            INSERT INTO facturas (
                id_empresa, receptor, rfc, folio, uuid, tipo_comprobante, 
                estado, fecha_emision, metodo_pago, forma_pago, 
                subtotal, total, iva
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            facturaData.id_empresa,
            facturaData.receptor,
            facturaData.rfc,
            facturaData.folio,
            facturaData.uuid,
            facturaData.tipo_comprobante,
            facturaData.estado || 'PENDIENTE',
            facturaData.fecha_emision,
            facturaData.metodo_pago,
            facturaData.forma_pago,
            facturaData.subtotal,
            facturaData.total,
            facturaData.iva || 0
        ];

        const result = await db.query(query, values);
        return { id: result[0].insertId, ...facturaData };
    }

    // Actualizar factura
    static async update(id, facturaData) {
        let query = `UPDATE facturas SET updated_at = CURRENT_TIMESTAMP`;
        const values = [];
        
        if (facturaData.id_empresa !== undefined) {
            query += `, id_empresa = ?`;
            values.push(facturaData.id_empresa);
        }
        if (facturaData.receptor !== undefined) {
            query += `, receptor = ?`;
            values.push(facturaData.receptor);
        }
        if (facturaData.rfc !== undefined) {
            query += `, rfc = ?`;
            values.push(facturaData.rfc);
        }
        if (facturaData.folio !== undefined) {
            query += `, folio = ?`;
            values.push(facturaData.folio);
        }
        if (facturaData.uuid !== undefined) {
            query += `, uuid = ?`;
            values.push(facturaData.uuid);
        }
        if (facturaData.tipo_comprobante !== undefined) {
            query += `, tipo_comprobante = ?`;
            values.push(facturaData.tipo_comprobante);
        }
        if (facturaData.estado !== undefined) {
            query += `, estado = ?`;
            values.push(facturaData.estado);
        }
        if (facturaData.fecha_emision !== undefined) {
            query += `, fecha_emision = ?`;
            values.push(facturaData.fecha_emision);
        }
        if (facturaData.metodo_pago !== undefined) {
            query += `, metodo_pago = ?`;
            values.push(facturaData.metodo_pago);
        }
        if (facturaData.forma_pago !== undefined) {
            query += `, forma_pago = ?`;
            values.push(facturaData.forma_pago);
        }
        if (facturaData.subtotal !== undefined) {
            query += `, subtotal = ?`;
            values.push(facturaData.subtotal);
        }
        if (facturaData.total !== undefined) {
            query += `, total = ?`;
            values.push(facturaData.total);
        }
        if (facturaData.iva !== undefined) {
            query += `, iva = ?`;
            values.push(facturaData.iva);
        }
        
        query += ` WHERE id = ?`;
        values.push(id);

        await db.query(query, values);
        return this.getById(id);
    }

    // Eliminar factura
    static async delete(id) {
        const factura = await this.getById(id);
        const query = 'DELETE FROM facturas WHERE id = ?';
        await db.query(query, [id]);
        return factura;
    }

    // Contar total de facturas
    static async count(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM facturas WHERE 1=1';
        const params = [];

        // Aplicar filtros
        if (filters.id_empresa) {
            query += ` AND id_empresa = ?`;
            params.push(filters.id_empresa);
        }

        if (filters.receptor) {
            query += ` AND receptor LIKE ?`;
            params.push(`%${filters.receptor}%`);
        }

        if (filters.rfc) {
            query += ` AND rfc LIKE ?`;
            params.push(`%${filters.rfc}%`);
        }

        if (filters.folio) {
            query += ` AND folio LIKE ?`;
            params.push(`%${filters.folio}%`);
        }

        if (filters.uuid) {
            query += ` AND uuid LIKE ?`;
            params.push(`%${filters.uuid}%`);
        }

        if (filters.tipo_comprobante) {
            query += ` AND tipo_comprobante = ?`;
            params.push(filters.tipo_comprobante);
        }

        if (filters.estado) {
            query += ` AND estado = ?`;
            params.push(filters.estado);
        }

        if (filters.fecha_desde) {
            query += ` AND fecha_emision >= ?`;
            params.push(filters.fecha_desde);
        }

        if (filters.fecha_hasta) {
            query += ` AND fecha_emision <= ?`;
            params.push(filters.fecha_hasta);
        }

        const result = await db.query(query, params);
        return parseInt(result[0][0].count);
    }

    // Obtener estadísticas de facturas
    static async getStats(filters = {}) {
        let query = `
            SELECT 
                COUNT(*) as total_facturas,
                COUNT(CASE WHEN estado = 'PAGADA' THEN 1 END) as facturas_pagadas,
                COUNT(CASE WHEN estado = 'PENDIENTE' THEN 1 END) as facturas_pendientes,
                COUNT(CASE WHEN estado = 'CANCELADA' THEN 1 END) as facturas_canceladas,
                SUM(total) as total_importe,
                SUM(CASE WHEN estado = 'PAGADA' THEN total ELSE 0 END) as importe_pagado,
                SUM(CASE WHEN estado = 'PENDIENTE' THEN total ELSE 0 END) as importe_pendiente,
                AVG(total) as promedio_factura
            FROM facturas
            WHERE 1=1
        `;
        
        const params = [];

        // Aplicar filtros
        if (filters.id_empresa) {
            query += ` AND id_empresa = ?`;
            params.push(filters.id_empresa);
        }

        if (filters.fecha_desde) {
            query += ` AND fecha_emision >= ?`;
            params.push(filters.fecha_desde);
        }

        if (filters.fecha_hasta) {
            query += ` AND fecha_emision <= ?`;
            params.push(filters.fecha_hasta);
        }

        const result = await db.query(query, params);
        return result[0][0];
    }

    // Obtener facturas por empresa
    static async getByEmpresa(idEmpresa, limit = 50, offset = 0) {
        const query = `
            SELECT f.*
            FROM facturas f
            WHERE f.id_empresa = ?
            ORDER BY f.fecha_emision DESC, f.id DESC
            LIMIT ? OFFSET ?
        `;
        const result = await db.query(query, [idEmpresa, limit, offset]);
        return result[0];
    }

    // Verificar si existe factura con folio
    static async existsByFolio(folio, excludeId = null) {
        let query = 'SELECT id FROM facturas WHERE folio = ?';
        const params = [folio];
        
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        
        const result = await db.query(query, params);
        return result[0].length > 0;
    }

    // Obtener estadísticas de facturas por período
    static async getStatsByPeriod(fecha_desde, fecha_hasta, id_empresa = null) {
        let query = `
            SELECT 
                COUNT(*) as total_facturas,
                COUNT(CASE WHEN estado = 'PAGADA' THEN 1 END) as facturas_pagadas,
                COUNT(CASE WHEN estado = 'PENDIENTE' THEN 1 END) as facturas_pendientes,
                COUNT(CASE WHEN estado = 'CANCELADA' THEN 1 END) as facturas_canceladas,
                SUM(total) as total_importe,
                SUM(CASE WHEN estado = 'PAGADA' THEN total ELSE 0 END) as importe_pagado,
                SUM(CASE WHEN estado = 'PENDIENTE' THEN total ELSE 0 END) as importe_pendiente,
                AVG(total) as promedio_factura,
                MIN(fecha_emision) as fecha_primera,
                MAX(fecha_emision) as fecha_ultima
            FROM facturas
            WHERE fecha_emision BETWEEN ? AND ?
        `;
        
        const params = [fecha_desde, fecha_hasta];
        
        if (id_empresa) {
            query += ` AND id_empresa = ?`;
            params.push(id_empresa);
        }

        const result = await db.query(query, params);
        return result[0][0];
    }

    // Obtener facturas por estado
    static async getByEstado(estado, limit = 50, offset = 0, filters = {}) {
        let query = `
            SELECT f.*, e.nombre as empresa_nombre
            FROM facturas f
            LEFT JOIN empresa e ON f.id_empresa = e.id
            WHERE f.estado = ?
        `;
        
        const params = [estado];

        // Aplicar filtros adicionales
        if (filters.id_empresa) {
            query += ` AND f.id_empresa = ?`;
            params.push(filters.id_empresa);
        }

        if (filters.fecha_desde) {
            query += ` AND f.fecha_emision >= ?`;
            params.push(filters.fecha_desde);
        }

        if (filters.fecha_hasta) {
            query += ` AND f.fecha_emision <= ?`;
            params.push(filters.fecha_hasta);
        }

        // Ordenar por fecha de emisión descendente
        query += ` ORDER BY f.fecha_emision DESC, f.id DESC`;

        // Aplicar límite y offset
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result[0];
    }

    // Obtener resumen de facturación por empresa
    static async getResumenPorEmpresa(fecha_desde = null, fecha_hasta = null) {
        let query = `
            SELECT 
                e.id,
                e.nombre as empresa_nombre,
                COUNT(f.id) as total_facturas,
                SUM(f.total) as monto_total,
                COUNT(CASE WHEN f.estado = 'PAGADA' THEN 1 END) as facturas_pagadas,
                COUNT(CASE WHEN f.estado = 'PENDIENTE' THEN 1 END) as facturas_pendientes,
                COUNT(CASE WHEN f.estado = 'CANCELADA' THEN 1 END) as facturas_canceladas,
                SUM(CASE WHEN f.estado = 'PAGADA' THEN f.total ELSE 0 END) as monto_pagado,
                SUM(CASE WHEN f.estado = 'PENDIENTE' THEN f.total ELSE 0 END) as monto_pendiente,
                AVG(f.total) as promedio_factura
            FROM empresa e
            LEFT JOIN facturas f ON e.id = f.id_empresa
            WHERE 1=1
        `;
        
        const params = [];

        if (fecha_desde) {
            query += ` AND f.fecha_emision >= ?`;
            params.push(fecha_desde);
        }

        if (fecha_hasta) {
            query += ` AND f.fecha_emision <= ?`;
            params.push(fecha_hasta);
        }

        query += ` GROUP BY e.id, e.nombre ORDER BY monto_total DESC`;

        const result = await db.query(query, params);
        return result[0];
    }
}

module.exports = Factura; 
const Factura = require('../models/factura.model');
const ComisionBroker = require('../models/comisionBroker.model');
const db = require('../config/database');

// Reporte de facturación general
const getReporteFacturacion = async (req, res) => {
    try {
        const { 
            fecha_desde, 
            fecha_hasta, 
            id_empresa, 
            estado,
            tipo_comprobante 
        } = req.query;

        let query = `
            SELECT 
                COUNT(*) as total_operaciones,
                SUM(total) as monto_total_facturado,
                SUM(subtotal) as subtotal_total,
                SUM(iva) as iva_total,
                COUNT(CASE WHEN estatus = 'FACTURADA' THEN 1 END) as operaciones_facturadas,
                COUNT(CASE WHEN estatus = 'PENDIENTE' THEN 1 END) as operaciones_pendientes,
                COUNT(CASE WHEN estatus = 'PREVIA' THEN 1 END) as operaciones_previas,
                SUM(CASE WHEN estatus = 'FACTURADA' THEN total ELSE 0 END) as monto_facturado,
                SUM(CASE WHEN estatus = 'PENDIENTE' THEN total ELSE 0 END) as monto_pendiente,
                AVG(total) as promedio_operacion,
                MIN(fecha_operacion) as fecha_primera_operacion,
                MAX(fecha_operacion) as fecha_ultima_operacion
            FROM operaciones o
            LEFT JOIN empresa e ON o.id_empresa = e.id
            WHERE 1=1
        `;

        const params = [];

        // Aplicar filtros
        if (fecha_desde) {
            query += ` AND o.fecha_operacion >= ?`;
            params.push(fecha_desde);
        }

        if (fecha_hasta) {
            query += ` AND o.fecha_operacion <= ?`;
            params.push(fecha_hasta);
        }

        if (id_empresa) {
            query += ` AND o.id_empresa = ?`;
            params.push(parseInt(id_empresa));
        }

        if (estado) {
            query += ` AND o.estatus = ?`;
            params.push(estado);
        }

        if (tipo_comprobante) {
            query += ` AND o.tipo_esquema = ?`;
            params.push(tipo_comprobante);
        }

        const result = await db.query(query, params);
        const reporte = result[0][0];

        // Obtener desglose mensual
        let desgloseMensual = null;
        let queryMensual = `
            SELECT 
                YEAR(o.fecha_operacion) as año,
                MONTH(o.fecha_operacion) as mes,
                CONCAT(YEAR(o.fecha_operacion), '-', LPAD(MONTH(o.fecha_operacion), 2, '0')) as periodo,
                COUNT(o.id) as total_operaciones,
                SUM(o.total) as monto_total_facturado
            FROM operaciones o
            WHERE 1=1
        `;

        const paramsMensual = [];
        if (fecha_desde) {
            queryMensual += ` AND o.fecha_operacion >= ?`;
            paramsMensual.push(fecha_desde);
        }
        if (fecha_hasta) {
            queryMensual += ` AND o.fecha_operacion <= ?`;
            paramsMensual.push(fecha_hasta);
        }
        if (id_empresa) {
            queryMensual += ` AND o.id_empresa = ?`;
            paramsMensual.push(parseInt(id_empresa));
        }
        if (estado) {
            queryMensual += ` AND o.estatus = ?`;
            paramsMensual.push(estado);
        }
        if (tipo_comprobante) {
            queryMensual += ` AND o.tipo_esquema = ?`;
            paramsMensual.push(tipo_comprobante);
        }

        queryMensual += ` GROUP BY YEAR(o.fecha_operacion), MONTH(o.fecha_operacion) ORDER BY año DESC, mes DESC`;

        const resultMensual = await db.query(queryMensual, paramsMensual);
        desgloseMensual = resultMensual[0];

        // Obtener desglose mensual de comisiones de brokers
        let desgloseComisionesBrokerMensual = null;
        let queryComisionesBrokerMensual = `
            SELECT 
                YEAR(cb.created_at) as año,
                MONTH(cb.created_at) as mes,
                CONCAT(YEAR(cb.created_at), '-', LPAD(MONTH(cb.created_at), 2, '0')) as periodo,
                COUNT(cb.id) as total_comisiones_broker,
                SUM(cb.comision) as monto_total_comisiones_broker,
                COUNT(CASE WHEN cb.estatus = 'PAGADA' THEN 1 END) as comisiones_broker_pagadas,
                COUNT(CASE WHEN cb.estatus = 'PENDIENTE' THEN 1 END) as comisiones_broker_pendientes,
                COUNT(CASE WHEN cb.estatus = 'CANCELADA' THEN 1 END) as comisiones_broker_canceladas,
                SUM(CASE WHEN cb.estatus = 'PAGADA' THEN cb.comision ELSE 0 END) as monto_broker_pagado,
                SUM(CASE WHEN cb.estatus = 'PENDIENTE' THEN cb.comision ELSE 0 END) as monto_broker_pendiente
            FROM comision_broker cb
            WHERE 1=1
        `;

        const paramsComisionesBrokerMensual = [];
        if (fecha_desde) {
            queryComisionesBrokerMensual += ` AND cb.created_at >= ?`;
            paramsComisionesBrokerMensual.push(fecha_desde);
        }
        if (fecha_hasta) {
            queryComisionesBrokerMensual += ` AND cb.created_at <= ?`;
            paramsComisionesBrokerMensual.push(fecha_hasta);
        }

        queryComisionesBrokerMensual += ` GROUP BY YEAR(cb.created_at), MONTH(cb.created_at) ORDER BY año DESC, mes DESC`;

        const resultComisionesBrokerMensual = await db.query(queryComisionesBrokerMensual, paramsComisionesBrokerMensual);
        desgloseComisionesBrokerMensual = resultComisionesBrokerMensual[0];

        // Obtener resumen de comisiones de brokers
        let resumenComisionesBroker = null;
        let queryResumenComisionesBroker = `
            SELECT 
                COUNT(*) as total_comisiones_broker,
                SUM(comision) as monto_total_comisiones_broker,
                COUNT(CASE WHEN estatus = 'PAGADA' THEN 1 END) as comisiones_broker_pagadas,
                COUNT(CASE WHEN estatus = 'PENDIENTE' THEN 1 END) as comisiones_broker_pendientes,
                COUNT(CASE WHEN estatus = 'CANCELADA' THEN 1 END) as comisiones_broker_canceladas,
                SUM(CASE WHEN estatus = 'PAGADA' THEN comision ELSE 0 END) as monto_broker_pagado,
                SUM(CASE WHEN estatus = 'PENDIENTE' THEN comision ELSE 0 END) as monto_broker_pendiente,
                AVG(comision) as promedio_comision_broker
            FROM comision_broker
            WHERE 1=1
        `;

        const paramsResumenComisionesBroker = [];
        if (fecha_desde) {
            queryResumenComisionesBroker += ` AND created_at >= ?`;
            paramsResumenComisionesBroker.push(fecha_desde);
        }
        if (fecha_hasta) {
            queryResumenComisionesBroker += ` AND created_at <= ?`;
            paramsResumenComisionesBroker.push(fecha_hasta);
        }

        const resultResumenComisionesBroker = await db.query(queryResumenComisionesBroker, paramsResumenComisionesBroker);
        resumenComisionesBroker = resultResumenComisionesBroker[0][0];

        // Obtener desglose mensual de comisiones generales
        let desgloseComisionesGeneralesMensual = null;
        let queryComisionesGeneralesMensual = `
            SELECT 
                YEAR(o.fecha_operacion) as año,
                MONTH(o.fecha_operacion) as mes,
                CONCAT(YEAR(o.fecha_operacion), '-', LPAD(MONTH(o.fecha_operacion), 2, '0')) as periodo,
                COUNT(CASE WHEN o.cms_general_num > 0 THEN 1 END) as total_comisiones_generales,
                SUM(o.cms_general_num) as monto_total_comisiones_generales,
                AVG(o.cms_general_num) as promedio_comision_general
            FROM operaciones o
            WHERE 1=1
        `;

        const paramsComisionesGeneralesMensual = [];
        if (fecha_desde) {
            queryComisionesGeneralesMensual += ` AND o.fecha_operacion >= ?`;
            paramsComisionesGeneralesMensual.push(fecha_desde);
        }
        if (fecha_hasta) {
            queryComisionesGeneralesMensual += ` AND o.fecha_operacion <= ?`;
            paramsComisionesGeneralesMensual.push(fecha_hasta);
        }
        if (id_empresa) {
            queryComisionesGeneralesMensual += ` AND o.id_empresa = ?`;
            paramsComisionesGeneralesMensual.push(parseInt(id_empresa));
        }
        if (estado) {
            queryComisionesGeneralesMensual += ` AND o.estatus = ?`;
            paramsComisionesGeneralesMensual.push(estado);
        }
        if (tipo_comprobante) {
            queryComisionesGeneralesMensual += ` AND o.tipo_esquema = ?`;
            paramsComisionesGeneralesMensual.push(tipo_comprobante);
        }

        queryComisionesGeneralesMensual += ` GROUP BY YEAR(o.fecha_operacion), MONTH(o.fecha_operacion) ORDER BY año DESC, mes DESC`;

        const resultComisionesGeneralesMensual = await db.query(queryComisionesGeneralesMensual, paramsComisionesGeneralesMensual);
        desgloseComisionesGeneralesMensual = resultComisionesGeneralesMensual[0];

        // Obtener resumen de comisiones generales
        let resumenComisionesGenerales = null;
        let queryResumenComisionesGenerales = `
            SELECT 
                COUNT(CASE WHEN o.cms_general_num > 0 THEN 1 END) as total_comisiones_generales,
                SUM(o.cms_general_num) as monto_total_comisiones_generales,
                AVG(o.cms_general_num) as promedio_comision_general
            FROM operaciones o
            WHERE 1=1
        `;

        const paramsResumenComisionesGenerales = [];
        if (fecha_desde) {
            queryResumenComisionesGenerales += ` AND o.fecha_operacion >= ?`;
            paramsResumenComisionesGenerales.push(fecha_desde);
        }
        if (fecha_hasta) {
            queryResumenComisionesGenerales += ` AND o.fecha_operacion <= ?`;
            paramsResumenComisionesGenerales.push(fecha_hasta);
        }
        if (id_empresa) {
            queryResumenComisionesGenerales += ` AND o.id_empresa = ?`;
            paramsResumenComisionesGenerales.push(parseInt(id_empresa));
        }
        if (estado) {
            queryResumenComisionesGenerales += ` AND o.estatus = ?`;
            paramsResumenComisionesGenerales.push(estado);
        }
        if (tipo_comprobante) {
            queryResumenComisionesGenerales += ` AND o.tipo_esquema = ?`;
            paramsResumenComisionesGenerales.push(tipo_comprobante);
        }

        const resultResumenComisionesGenerales = await db.query(queryResumenComisionesGenerales, paramsResumenComisionesGenerales);
        resumenComisionesGenerales = resultResumenComisionesGenerales[0][0];

        // Obtener desglose mensual de gastos (por implementar cuando se cree la tabla)
        let desgloseGastosMensual = null;
        // TODO: Implementar cuando se cree la tabla de gastos
        // let queryGastosMensual = `
        //     SELECT 
        //         YEAR(g.fecha_gasto) as año,
        //         MONTH(g.fecha_gasto) as mes,
        //         CONCAT(YEAR(g.fecha_gasto), '-', LPAD(MONTH(g.fecha_gasto), 2, '0')) as periodo,
        //         COUNT(g.id) as total_gastos,
        //         SUM(g.monto) as monto_total_gastos,
        //         COUNT(CASE WHEN g.estatus = 'PAGADO' THEN 1 END) as gastos_pagados,
        //         COUNT(CASE WHEN g.estatus = 'PENDIENTE' THEN 1 END) as gastos_pendientes,
        //         COUNT(CASE WHEN g.estatus = 'CANCELADO' THEN 1 END) as gastos_cancelados,
        //         SUM(CASE WHEN g.estatus = 'PAGADO' THEN g.monto ELSE 0 END) as monto_gastos_pagado,
        //         SUM(CASE WHEN g.estatus = 'PENDIENTE' THEN g.monto ELSE 0 END) as monto_gastos_pendiente,
        //         AVG(g.monto) as promedio_gasto
        //     FROM gastos g
        //     WHERE 1=1
        // `;
        
        // Por ahora enviar array vacío
        desgloseGastosMensual = [];

        // Obtener resumen de gastos (por implementar cuando se cree la tabla)
        let resumenGastos = null;
        // TODO: Implementar cuando se cree la tabla de gastos
        // let queryResumenGastos = `
        //     SELECT 
        //         COUNT(*) as total_gastos,
        //         SUM(monto) as monto_total_gastos,
        //         COUNT(CASE WHEN estatus = 'PAGADO' THEN 1 END) as gastos_pagados,
        //         COUNT(CASE WHEN estatus = 'PENDIENTE' THEN 1 END) as gastos_pendientes,
        //         COUNT(CASE WHEN estatus = 'CANCELADO' THEN 1 END) as gastos_cancelados,
        //         SUM(CASE WHEN estatus = 'PAGADO' THEN monto ELSE 0 END) as monto_gastos_pagado,
        //         SUM(CASE WHEN estatus = 'PENDIENTE' THEN monto ELSE 0 END) as monto_gastos_pendiente,
        //         AVG(monto) as promedio_gasto
        //     FROM gastos
        //     WHERE 1=1
        // `;
        
        // Por ahora enviar objeto con valores nulos
        resumenGastos = {
            total_gastos: 0,
            monto_total_gastos: 0.00,
            gastos_pagados: 0,
            gastos_pendientes: 0,
            gastos_cancelados: 0,
            monto_gastos_pagado: 0.00,
            monto_gastos_pendiente: 0.00,
            promedio_gasto: 0.00
        };

        res.status(200).json({
            success: true,
            data: {
                resumen: reporte,
                resumen_comisiones_broker: resumenComisionesBroker,
                resumen_comisiones_generales: resumenComisionesGenerales,
                resumen_gastos: resumenGastos,
                desglose_mensual: desgloseMensual,
                desglose_comisiones_broker_mensual: desgloseComisionesBrokerMensual,
                desglose_comisiones_generales_mensual: desgloseComisionesGeneralesMensual,
                desglose_gastos_mensual: desgloseGastosMensual,
                filtros_aplicados: {
                    fecha_desde,
                    fecha_hasta,
                    id_empresa,
                    estado,
                    tipo_comprobante
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener reporte de facturación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Reporte de comisiones de brokers
const getReporteComisionesBrokers = async (req, res) => {
    try {
        const { 
            fecha_desde, 
            fecha_hasta, 
            id_broker,
            estatus 
        } = req.query;

        let query = `
            SELECT 
                COUNT(*) as total_comisiones,
                COUNT(DISTINCT id_broker) as total_brokers,
                COUNT(DISTINCT id_operacion) as total_operaciones,
                SUM(comision) as monto_total_comisiones,
                COUNT(CASE WHEN estatus = 'PAGADA' THEN 1 END) as comisiones_pagadas,
                COUNT(CASE WHEN estatus = 'PENDIENTE' THEN 1 END) as comisiones_pendientes,
                COUNT(CASE WHEN estatus = 'CANCELADA' THEN 1 END) as comisiones_canceladas,
                SUM(CASE WHEN estatus = 'PAGADA' THEN comision ELSE 0 END) as monto_pagado,
                SUM(CASE WHEN estatus = 'PENDIENTE' THEN comision ELSE 0 END) as monto_pendiente,
                SUM(CASE WHEN estatus = 'CANCELADA' THEN comision ELSE 0 END) as monto_cancelado,
                AVG(comision) as promedio_comision,
                MIN(created_at) as fecha_primera_comision,
                MAX(created_at) as fecha_ultima_comision
            FROM comision_broker cb
            WHERE 1=1
        `;

        const params = [];

        // Aplicar filtros
        if (fecha_desde) {
            query += ` AND cb.created_at >= ?`;
            params.push(fecha_desde);
        }

        if (fecha_hasta) {
            query += ` AND cb.created_at <= ?`;
            params.push(fecha_hasta);
        }

        if (id_broker) {
            query += ` AND cb.id_broker = ?`;
            params.push(parseInt(id_broker));
        }

        if (estatus) {
            query += ` AND cb.estatus = ?`;
            params.push(estatus);
        }

        const result = await db.query(query, params);
        const reporte = result[0][0];

        // Obtener desglose por broker si no se especifica un broker
        let desgloseBrokers = null;
        if (!id_broker) {
            let queryBrokers = `
                SELECT 
                    b.id,
                    b.nombre as broker_nombre,
                    COUNT(cb.id) as total_comisiones,
                    SUM(cb.comision) as monto_total,
                    COUNT(CASE WHEN cb.estatus = 'PAGADA' THEN 1 END) as comisiones_pagadas,
                    COUNT(CASE WHEN cb.estatus = 'PENDIENTE' THEN 1 END) as comisiones_pendientes,
                    COUNT(CASE WHEN cb.estatus = 'CANCELADA' THEN 1 END) as comisiones_canceladas,
                    SUM(CASE WHEN cb.estatus = 'PAGADA' THEN cb.comision ELSE 0 END) as monto_pagado,
                    SUM(CASE WHEN cb.estatus = 'PENDIENTE' THEN cb.comision ELSE 0 END) as monto_pendiente,
                    AVG(cb.comision) as promedio_comision
                FROM broker b
                LEFT JOIN comision_broker cb ON b.id = cb.id_broker
                WHERE 1=1
            `;

            const paramsBrokers = [];
            if (fecha_desde) {
                queryBrokers += ` AND cb.created_at >= ?`;
                paramsBrokers.push(fecha_desde);
            }
            if (fecha_hasta) {
                queryBrokers += ` AND cb.created_at <= ?`;
                paramsBrokers.push(fecha_hasta);
            }
            if (estatus) {
                queryBrokers += ` AND cb.estatus = ?`;
                paramsBrokers.push(estatus);
            }

            queryBrokers += ` GROUP BY b.id, b.nombre ORDER BY monto_total DESC`;

            const resultBrokers = await db.query(queryBrokers, paramsBrokers);
            desgloseBrokers = resultBrokers[0];
        }

        res.status(200).json({
            success: true,
            data: {
                resumen: reporte,
                desglose_por_broker: desgloseBrokers,
                filtros_aplicados: {
                    fecha_desde,
                    fecha_hasta,
                    id_broker,
                    estatus
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener reporte de comisiones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Reporte de pagos (movimientos bancarios aplicados a facturas)
const getReportePagos = async (req, res) => {
    try {
        const { 
            fecha_desde, 
            fecha_hasta, 
            id_empresa,
            metodo_pago 
        } = req.query;

        let query = `
            SELECT 
                COUNT(DISTINCT fmb.id_factura) as facturas_con_pagos,
                COUNT(fmb.id) as total_movimientos_aplicados,
                SUM(fmb.monto_asignado) as monto_total_pagado,
                COUNT(DISTINCT mb.id) as total_movimientos_bancarios,
                SUM(mb.monto) as monto_total_movimientos,
                AVG(fmb.monto_asignado) as promedio_pago_por_factura,
                MIN(fmb.fecha_asignacion) as fecha_primer_pago,
                MAX(fmb.fecha_asignacion) as fecha_ultimo_pago
            FROM factura_movimiento_bancario fmb
            LEFT JOIN movimientos_bancarios mb ON fmb.id_movimiento_bancario = mb.id
            LEFT JOIN facturas f ON fmb.id_factura = f.id
            WHERE 1=1
        `;

        const params = [];

        // Aplicar filtros
        if (fecha_desde) {
            query += ` AND fmb.fecha_asignacion >= ?`;
            params.push(fecha_desde);
        }

        if (fecha_hasta) {
            query += ` AND fmb.fecha_asignacion <= ?`;
            params.push(fecha_hasta);
        }

        if (id_empresa) {
            query += ` AND f.id_empresa = ?`;
            params.push(parseInt(id_empresa));
        }

        if (metodo_pago) {
            query += ` AND mb.tipo_movimiento = ?`;
            params.push(metodo_pago);
        }

        const result = await db.query(query, params);
        const reporte = result[0][0];

        // Obtener desglose por empresa si no se especifica una empresa
        let desgloseEmpresas = null;
        if (!id_empresa) {
            let queryEmpresas = `
                SELECT 
                    e.id,
                    e.nombre as empresa_nombre,
                    COUNT(DISTINCT fmb.id_factura) as facturas_con_pagos,
                    COUNT(fmb.id) as total_movimientos_aplicados,
                    SUM(fmb.monto_asignado) as monto_total_pagado,
                    AVG(fmb.monto_asignado) as promedio_pago_por_factura
                FROM empresa e
                LEFT JOIN facturas f ON e.id = f.id_empresa
                LEFT JOIN factura_movimiento_bancario fmb ON f.id = fmb.id_factura
                WHERE 1=1
            `;

            const paramsEmpresas = [];
            if (fecha_desde) {
                queryEmpresas += ` AND fmb.fecha_asignacion >= ?`;
                paramsEmpresas.push(fecha_desde);
            }
            if (fecha_hasta) {
                queryEmpresas += ` AND fmb.fecha_asignacion <= ?`;
                paramsEmpresas.push(fecha_hasta);
            }
            if (metodo_pago) {
                queryEmpresas += ` AND EXISTS (
                    SELECT 1 FROM movimientos_bancarios mb 
                    WHERE mb.id = fmb.id_movimiento_bancario 
                    AND mb.tipo_movimiento = ?
                )`;
                paramsEmpresas.push(metodo_pago);
            }

            queryEmpresas += ` GROUP BY e.id, e.nombre ORDER BY monto_total_pagado DESC`;

            const resultEmpresas = await db.query(queryEmpresas, paramsEmpresas);
            desgloseEmpresas = resultEmpresas[0];
        }

        res.status(200).json({
            success: true,
            data: {
                resumen: reporte,
                desglose_por_empresa: desgloseEmpresas,
                filtros_aplicados: {
                    fecha_desde,
                    fecha_hasta,
                    id_empresa,
                    metodo_pago
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener reporte de pagos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Reporte consolidado (todos los datos en uno)
const getReporteConsolidado = async (req, res) => {
    try {
        const { 
            fecha_desde, 
            fecha_hasta, 
            id_empresa 
        } = req.query;

        // Obtener datos de facturación
        const facturacionData = await getReporteFacturacionData(fecha_desde, fecha_hasta, id_empresa);
        
        // Obtener datos de comisiones
        const comisionesData = await getReporteComisionesData(fecha_desde, fecha_hasta);
        
        // Obtener datos de pagos
        const pagosData = await getReportePagosData(fecha_desde, fecha_hasta, id_empresa);

        res.status(200).json({
            success: true,
            data: {
                facturacion: facturacionData,
                comisiones_brokers: comisionesData,
                pagos: pagosData,
                filtros_aplicados: {
                    fecha_desde,
                    fecha_hasta,
                    id_empresa
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener reporte consolidado:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Funciones auxiliares para el reporte consolidado
const getReporteFacturacionData = async (fecha_desde, fecha_hasta, id_empresa) => {
    let query = `
        SELECT 
            COUNT(*) as total_facturas,
            SUM(total) as monto_total_facturado,
            COUNT(CASE WHEN estado = 'PAGADA' THEN 1 END) as facturas_pagadas,
            COUNT(CASE WHEN estado = 'PENDIENTE' THEN 1 END) as facturas_pendientes,
            SUM(CASE WHEN estado = 'PAGADA' THEN total ELSE 0 END) as monto_pagado,
            SUM(CASE WHEN estado = 'PENDIENTE' THEN total ELSE 0 END) as monto_pendiente
        FROM facturas
        WHERE 1=1
    `;

    const params = [];
    if (fecha_desde) {
        query += ` AND fecha_emision >= ?`;
        params.push(fecha_desde);
    }
    if (fecha_hasta) {
        query += ` AND fecha_emision <= ?`;
        params.push(fecha_hasta);
    }
    if (id_empresa) {
        query += ` AND id_empresa = ?`;
        params.push(parseInt(id_empresa));
    }

    const result = await db.query(query, params);
    return result[0][0];
};

const getReporteComisionesData = async (fecha_desde, fecha_hasta) => {
    let query = `
        SELECT 
            COUNT(*) as total_comisiones,
            SUM(comision) as monto_total_comisiones,
            COUNT(CASE WHEN estatus = 'PAGADA' THEN 1 END) as comisiones_pagadas,
            COUNT(CASE WHEN estatus = 'PENDIENTE' THEN 1 END) as comisiones_pendientes,
            SUM(CASE WHEN estatus = 'PAGADA' THEN comision ELSE 0 END) as monto_pagado,
            SUM(CASE WHEN estatus = 'PENDIENTE' THEN comision ELSE 0 END) as monto_pendiente
        FROM comision_broker
        WHERE 1=1
    `;

    const params = [];
    if (fecha_desde) {
        query += ` AND created_at >= ?`;
        params.push(fecha_desde);
    }
    if (fecha_hasta) {
        query += ` AND created_at <= ?`;
        params.push(fecha_hasta);
    }

    const result = await db.query(query, params);
    return result[0][0];
};

const getReportePagosData = async (fecha_desde, fecha_hasta, id_empresa) => {
    let query = `
        SELECT 
            COUNT(DISTINCT fmb.id_factura) as facturas_con_pagos,
            SUM(fmb.monto_asignado) as monto_total_pagado
        FROM factura_movimiento_bancario fmb
        LEFT JOIN facturas f ON fmb.id_factura = f.id
        WHERE 1=1
    `;

    const params = [];
    if (fecha_desde) {
        query += ` AND fmb.fecha_asignacion >= ?`;
        params.push(fecha_desde);
    }
    if (fecha_hasta) {
        query += ` AND fmb.fecha_asignacion <= ?`;
        params.push(fecha_hasta);
    }
    if (id_empresa) {
        query += ` AND f.id_empresa = ?`;
        params.push(parseInt(id_empresa));
    }

    const result = await db.query(query, params);
    return result[0][0];
};

module.exports = {
    getReporteFacturacion,
    getReporteComisionesBrokers,
    getReportePagos,
    getReporteConsolidado
};

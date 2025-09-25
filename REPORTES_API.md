# Sistema de Reportes - API AdministradorNum

## Descripción General

El sistema de reportes permite obtener información consolidada sobre facturación, comisiones de brokers y pagos aplicados. Los reportes están diseñados para ser flexibles y permitir filtrado por diferentes criterios.

## Endpoints Disponibles

### 1. Reporte de Operaciones (Facturación)
**GET** `/api/reportes/facturacion`

Obtiene estadísticas detalladas sobre las operaciones, comisiones de brokers, comisiones generales y gastos, incluyendo montos totales, operaciones por estado, desglose mensual de operaciones, comisiones de brokers, comisiones generales y gastos.

#### Parámetros de consulta (opcionales):
- `fecha_desde`: Fecha de inicio (formato: YYYY-MM-DD)
- `fecha_hasta`: Fecha de fin (formato: YYYY-MM-DD)
- `id_empresa`: ID de la empresa específica
- `estado`: Estado de la operación (FACTURADA, PENDIENTE, PREVIA)
- `tipo_comprobante`: Tipo de esquema (FACTURA, SINDICATO, SAPI, C909, BANCARIZACION, CONTABILIDAD)

#### Respuesta:
```json
{
  "success": true,
  "data": {
    "resumen": {
      "total_operaciones": 150,
      "monto_total_facturado": 2500000.00,
      "subtotal_total": 2155172.41,
      "iva_total": 344827.59,
      "operaciones_facturadas": 120,
      "operaciones_pendientes": 25,
      "operaciones_previas": 5,
      "monto_facturado": 2000000.00,
      "monto_pendiente": 450000.00,
      "promedio_operacion": 16666.67,
      "fecha_primera_operacion": "2024-01-01",
      "fecha_ultima_operacion": "2024-12-31"
    },
    "resumen_comisiones_broker": {
      "total_comisiones_broker": 300,
      "monto_total_comisiones_broker": 150000.00,
      "comisiones_broker_pagadas": 280,
      "comisiones_broker_pendientes": 15,
      "comisiones_broker_canceladas": 5,
      "monto_broker_pagado": 140000.00,
      "monto_broker_pendiente": 8000.00,
      "promedio_comision_broker": 500.00
    },
    "resumen_comisiones_generales": {
      "total_comisiones_generales": 120,
      "monto_total_comisiones_generales": 60000.00,
      "promedio_comision_general": 500.00
    },
    "resumen_gastos": {
      "total_gastos": 0,
      "monto_total_gastos": 0.00,
      "gastos_pagados": 0,
      "gastos_pendientes": 0,
      "gastos_cancelados": 0,
      "monto_gastos_pagado": 0.00,
      "monto_gastos_pendiente": 0.00,
      "promedio_gasto": 0.00
    },
    "desglose_mensual": [
      {
        "año": 2024,
        "mes": 12,
        "periodo": "2024-12",
        "total_operaciones": 15,
        "monto_total_facturado": 250000.00
      },
      {
        "año": 2024,
        "mes": 11,
        "periodo": "2024-11",
        "total_operaciones": 18,
        "monto_total_facturado": 300000.00
      }
    ],
    "desglose_comisiones_broker_mensual": [
      {
        "año": 2024,
        "mes": 12,
        "periodo": "2024-12",
        "total_comisiones_broker": 25,
        "monto_total_comisiones_broker": 12500.00,
        "comisiones_broker_pagadas": 23,
        "comisiones_broker_pendientes": 2,
        "comisiones_broker_canceladas": 0,
        "monto_broker_pagado": 11500.00,
        "monto_broker_pendiente": 1000.00
      },
      {
        "año": 2024,
        "mes": 11,
        "periodo": "2024-11",
        "total_comisiones_broker": 30,
        "monto_total_comisiones_broker": 15000.00,
        "comisiones_broker_pagadas": 28,
        "comisiones_broker_pendientes": 2,
        "comisiones_broker_canceladas": 0,
        "monto_broker_pagado": 14000.00,
        "monto_broker_pendiente": 1000.00
      }
    ],
    "desglose_comisiones_generales_mensual": [
      {
        "año": 2024,
        "mes": 12,
        "periodo": "2024-12",
        "total_comisiones_generales": 10,
        "monto_total_comisiones_generales": 5000.00,
        "promedio_comision_general": 500.00
      },
      {
        "año": 2024,
        "mes": 11,
        "periodo": "2024-11",
        "total_comisiones_generales": 12,
        "monto_total_comisiones_generales": 6000.00,
        "promedio_comision_general": 500.00
      }
    ],
    "desglose_gastos_mensual": [],
    "filtros_aplicados": {
      "fecha_desde": "2024-01-01",
      "fecha_hasta": "2024-12-31"
    }
  }
}
```

### 2. Reporte de Comisiones de Brokers
**GET** `/api/reportes/comisiones-brokers`

Obtiene estadísticas sobre las comisiones pagadas a brokers, incluyendo montos totales y desglose por broker.

#### Parámetros de consulta (opcionales):
- `fecha_desde`: Fecha de inicio (formato: YYYY-MM-DD)
- `fecha_hasta`: Fecha de fin (formato: YYYY-MM-DD)
- `id_broker`: ID del broker específico
- `estatus`: Estatus de la comisión (PAGADA, PENDIENTE, CANCELADA)

#### Respuesta:
```json
{
  "success": true,
  "data": {
    "resumen": {
      "total_comisiones": 300,
      "total_brokers": 15,
      "total_operaciones": 250,
      "comisiones_pagadas": 280,
      "comisiones_pendientes": 15,
      "comisiones_canceladas": 5,
      "monto_total_comisiones": 150000.00,
      "monto_pagado": 140000.00,
      "monto_pendiente": 8000.00,
      "monto_cancelado": 2000.00,
      "promedio_comision": 500.00,
      "fecha_primera_comision": "2024-01-01",
      "fecha_ultima_comision": "2024-12-31"
    },
    "desglose_por_broker": [
      {
        "id": 1,
        "broker_nombre": "Broker A",
        "total_comisiones": 50,
        "monto_total": 25000.00,
        "comisiones_pagadas": 45,
        "comisiones_pendientes": 4,
        "comisiones_canceladas": 1,
        "monto_pagado": 22500.00,
        "monto_pendiente": 2000.00,
        "promedio_comision": 500.00
      }
    ],
    "filtros_aplicados": {
      "fecha_desde": "2024-01-01",
      "fecha_hasta": "2024-12-31"
    }
  }
}
```

### 3. Reporte de Pagos
**GET** `/api/reportes/pagos`

Obtiene estadísticas sobre los pagos aplicados a facturas a través de movimientos bancarios.

#### Parámetros de consulta (opcionales):
- `fecha_desde`: Fecha de inicio (formato: YYYY-MM-DD)
- `fecha_hasta`: Fecha de fin (formato: YYYY-MM-DD)
- `id_empresa`: ID de la empresa específica
- `metodo_pago`: Método de pago utilizado

#### Respuesta:
```json
{
  "success": true,
  "data": {
    "resumen": {
      "facturas_con_pagos": 120,
      "total_movimientos_aplicados": 150,
      "monto_total_pagado": 2000000.00,
      "total_movimientos_bancarios": 200,
      "monto_total_movimientos": 2500000.00,
      "promedio_pago_por_factura": 16666.67,
      "fecha_primer_pago": "2024-01-01",
      "fecha_ultimo_pago": "2024-12-31"
    },
    "desglose_por_empresa": [
      {
        "id": 1,
        "empresa_nombre": "Empresa A",
        "facturas_con_pagos": 80,
        "total_movimientos_aplicados": 100,
        "monto_total_pagado": 1500000.00,
        "promedio_pago_por_factura": 18750.00
      }
    ],
    "filtros_aplicados": {
      "fecha_desde": "2024-01-01",
      "fecha_hasta": "2024-12-31"
    }
  }
}
```

### 4. Reporte Consolidado
**GET** `/api/reportes/consolidado`

Obtiene un reporte que combina información de facturación, comisiones y pagos en una sola respuesta.

#### Parámetros de consulta (opcionales):
- `fecha_desde`: Fecha de inicio (formato: YYYY-MM-DD)
- `fecha_hasta`: Fecha de fin (formato: YYYY-MM-DD)
- `id_empresa`: ID de la empresa específica

#### Respuesta:
```json
{
  "success": true,
  "data": {
    "facturacion": {
      "total_facturas": 150,
      "monto_total_facturado": 2500000.00,
      "facturas_pagadas": 120,
      "facturas_pendientes": 25,
      "monto_pagado": 2000000.00,
      "monto_pendiente": 450000.00
    },
    "comisiones_brokers": {
      "total_comisiones": 300,
      "monto_total_comisiones": 150000.00,
      "comisiones_pagadas": 280,
      "comisiones_pendientes": 15,
      "monto_pagado": 140000.00,
      "monto_pendiente": 8000.00
    },
    "pagos": {
      "facturas_con_pagos": 120,
      "monto_total_pagado": 2000000.00
    },
    "filtros_aplicados": {
      "fecha_desde": "2024-01-01",
      "fecha_hasta": "2024-12-31"
    }
  }
}
```

## Ejemplos de Uso

### 1. Obtener operaciones del último mes con desglose mensual
```bash
GET /api/reportes/facturacion?fecha_desde=2024-11-01&fecha_hasta=2024-11-30
```

### 2. Obtener operaciones de todo el año con desglose mensual
```bash
GET /api/reportes/facturacion?fecha_desde=2024-01-01&fecha_hasta=2024-12-31
```

### 3. Obtener operaciones de una empresa específica por trimestre
```bash
GET /api/reportes/facturacion?id_empresa=3&fecha_desde=2024-10-01&fecha_hasta=2024-12-31
```

### 4. Obtener solo operaciones facturadas con desglose mensual
```bash
GET /api/reportes/facturacion?estado=FACTURADA&fecha_desde=2024-01-01&fecha_hasta=2024-12-31
```

### 5. Obtener comisiones pendientes de un broker específico
```bash
GET /api/reportes/comisiones-brokers?id_broker=5&estatus=PENDIENTE
```

### 6. Obtener reporte consolidado de una empresa específica
```bash
GET /api/reportes/consolidado?id_empresa=3&fecha_desde=2024-01-01&fecha_hasta=2024-12-31
```

### 7. Obtener pagos del último trimestre
```bash
GET /api/reportes/pagos?fecha_desde=2024-10-01&fecha_hasta=2024-12-31
```

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT. Incluye el token en el header de autorización:

```
Authorization: Bearer <tu_token_jwt>
```

## Códigos de Respuesta

- `200`: Éxito
- `400`: Error en los parámetros de consulta
- `401`: No autorizado (token inválido o faltante)
- `500`: Error interno del servidor

## Notas Importantes

1. **Fechas**: Todas las fechas deben estar en formato YYYY-MM-DD
2. **Montos**: Todos los montos se devuelven en formato decimal con 2 decimales
3. **Filtros**: Los filtros son opcionales y se pueden combinar según sea necesario
4. **Paginación**: Los reportes consolidados no incluyen paginación, pero los desgloses pueden ser limitados por los filtros aplicados
5. **Rendimiento**: Para períodos muy largos, considera usar filtros de fecha para mejorar el rendimiento

## Características del Desglose Mensual

El reporte de facturación ahora incluye **cuatro desgloses mensuales**:

### Desglose Mensual de Operaciones
- **Año y mes**: Identificación del período
- **Período**: Formato YYYY-MM para fácil identificación
- **Total de operaciones**: Número de operaciones realizadas en el mes
- **Monto total facturado**: Suma total de todas las operaciones del mes

### Desglose Mensual de Comisiones de Brokers
- **Año y mes**: Identificación del período
- **Período**: Formato YYYY-MM para fácil identificación
- **Total de comisiones de broker**: Número de comisiones de brokers generadas en el mes
- **Monto total de comisiones de broker**: Suma total de todas las comisiones de brokers del mes
- **Comisiones de broker por estado**: Cantidad de comisiones pagadas, pendientes y canceladas
- **Montos de broker por estado**: Montos correspondientes a cada estado de comisión

### Desglose Mensual de Comisiones Generales
- **Año y mes**: Identificación del período
- **Período**: Formato YYYY-MM para fácil identificación
- **Total de comisiones generales**: Número de operaciones con comisiones generales en el mes
- **Monto total de comisiones generales**: Suma total de todas las comisiones generales del mes
- **Promedio de comisión general**: Valor promedio de las comisiones generales del mes

### Desglose Mensual de Gastos
- **Año y mes**: Identificación del período
- **Período**: Formato YYYY-MM para fácil identificación
- **Total de gastos**: Número de gastos registrados en el mes
- **Monto total de gastos**: Suma total de todos los gastos del mes
- **Gastos por estado**: Cantidad de gastos pagados, pendientes y cancelados
- **Montos por estado**: Montos correspondientes a cada estado de gasto
- **Promedio de gasto**: Valor promedio de los gastos del mes

**Nota**: El desglose de gastos está preparado para cuando se implemente la tabla de gastos. Por ahora devuelve valores vacíos.

### Ejemplo de uso del desglose mensual:

```bash
# Obtener facturación del año 2024 con desglose mensual
GET /api/reportes/facturacion?fecha_desde=2024-01-01&fecha_hasta=2024-12-31

# Respuesta incluirá arrays "desglose_mensual", "desglose_comisiones_broker_mensual", "desglose_comisiones_generales_mensual" y "desglose_gastos_mensual" con datos como:
{
  "desglose_mensual": [
    {
      "año": 2024,
      "mes": 12,
      "periodo": "2024-12",
      "total_operaciones": 15,
      "monto_total_facturado": 250000.00
    }
  ],
  "desglose_comisiones_broker_mensual": [
    {
      "año": 2024,
      "mes": 12,
      "periodo": "2024-12",
      "total_comisiones_broker": 25,
      "monto_total_comisiones_broker": 12500.00,
      "comisiones_broker_pagadas": 23,
      "comisiones_broker_pendientes": 2,
      "comisiones_broker_canceladas": 0,
      "monto_broker_pagado": 11500.00,
      "monto_broker_pendiente": 1000.00
    }
  ],
  "desglose_comisiones_generales_mensual": [
    {
      "año": 2024,
      "mes": 12,
      "periodo": "2024-12",
      "total_comisiones_generales": 10,
      "monto_total_comisiones_generales": 5000.00,
      "promedio_comision_general": 500.00
    }
  ],
  "desglose_gastos_mensual": [
    {
      "año": 2024,
      "mes": 12,
      "periodo": "2024-12",
      "total_gastos": 8,
      "monto_total_gastos": 4000.00,
      "gastos_pagados": 6,
      "gastos_pendientes": 2,
      "gastos_cancelados": 0,
      "monto_gastos_pagado": 3000.00,
      "monto_gastos_pendiente": 1000.00,
      "promedio_gasto": 500.00
    }
  ]
}
```

## Casos de Uso Comunes

### Dashboard Principal
Usa el reporte consolidado para obtener una vista general del estado financiero:
```bash
GET /api/reportes/consolidado?fecha_desde=2024-01-01&fecha_hasta=2024-12-31
```

### Análisis de Facturación por Empresa
```bash
GET /api/reportes/facturacion?id_empresa=1&fecha_desde=2024-01-01&fecha_hasta=2024-12-31
```

### Seguimiento de Comisiones Pendientes
```bash
GET /api/reportes/comisiones-brokers?estatus=PENDIENTE
```

### Análisis de Pagos por Período
```bash
GET /api/reportes/pagos?fecha_desde=2024-01-01&fecha_hasta=2024-03-31
```

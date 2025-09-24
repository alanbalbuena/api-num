# API Endpoints - Documentación Completa

## Información General

**Base URL:** `/api`

**Autenticación:** Todos los endpoints requieren autenticación JWT excepto los de autenticación pública.

**Roles disponibles:**
- `ADMINISTRACION` - Acceso completo
- `FACTURACION` - Acceso a facturación y pagos
- `CONTADOR` - Acceso a movimientos bancarios

---

## 🔐 Autenticación

### Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/refresh` | Renovar token de acceso |
| `POST` | `/auth/logout` | Cerrar sesión |

### Endpoints Protegidos

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `POST` | `/auth/register` | Registrar nuevo usuario | `ADMINISTRACION` |
| `GET` | `/auth/profile` | Obtener perfil del usuario | Autenticado |
| `PUT` | `/auth/change-password` | Cambiar contraseña | Autenticado |

---

## 👥 Usuarios

**Base URL:** `/api/usuarios`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/usuarios` | Obtener todos los usuarios | `ADMINISTRACION` |
| `GET` | `/usuarios/:id` | Obtener usuario por ID | Usuario o `ADMINISTRACION` |
| `POST` | `/usuarios` | Crear nuevo usuario | `ADMINISTRACION` |
| `PUT` | `/usuarios/:id` | Actualizar usuario | Usuario o `ADMINISTRACION` |
| `DELETE` | `/usuarios/:id` | Eliminar usuario | `ADMINISTRACION` |

---

## 🏢 Empresas

**Base URL:** `/api/empresas`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/empresas` | Obtener todas las empresas | Autenticado |
| `GET` | `/empresas/:id` | Obtener empresa por ID | Autenticado |
| `GET` | `/empresas/rfc/:rfc` | Obtener empresa por RFC | Autenticado |
| `POST` | `/empresas` | Crear nueva empresa | `ADMINISTRACION` |
| `PUT` | `/empresas/:id` | Actualizar empresa | `ADMINISTRACION` |
| `DELETE` | `/empresas/:id` | Eliminar empresa | `ADMINISTRACION` |

---

## 👤 Clientes

**Base URL:** `/api/clientes`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/clientes` | Obtener todos los clientes | Autenticado |
| `GET` | `/clientes/:id` | Obtener cliente por ID (incluye razones sociales y esquemas) | Autenticado |



| `GET` | `/clientes/letter/:letter` | Buscar clientes por letra | Autenticado |
| `POST` | `/clientes` | Crear nuevo cliente | `ADMINISTRACION` |
| `PUT` | `/clientes/:id` | Actualizar cliente | `ADMINISTRACION` |
| `DELETE` | `/clientes/:id` | Eliminar cliente | `ADMINISTRACION` |

---

## 📊 Esquemas

**Base URL:** `/api/esquemas`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/esquemas` | Obtener todos los esquemas | Autenticado |
| `GET` | `/esquemas/cliente/:clienteId` | Obtener esquemas por cliente | Autenticado |
| `GET` | `/esquemas/razon-social/:razonSocialId` | Obtener esquemas por razón social | Autenticado |
| `POST` | `/esquemas` | Crear nuevo esquema | Autenticado |
| `PUT` | `/esquemas/:id` | Actualizar esquema | Autenticado |
| `DELETE` | `/esquemas/:id` | Eliminar esquema | Autenticado |

**Campos para crear/actualizar esquema:**
- `id_razon_social` (obligatorio): ID de la razón social
- `tipo_esquema` (obligatorio): Tipo de esquema (ej: FACTURA, COMISION, etc.)
- `porcentaje_esquema` (opcional): Porcentaje del esquema
- `costo` (opcional): Tipo de costo (por defecto: "TOTAL")
- `id_broker1` (opcional): ID del primer broker
- `porcentaje_broker1` (opcional): Porcentaje del primer broker
- `id_broker2` (opcional): ID del segundo broker
- `porcentaje_broker2` (opcional): Porcentaje del segundo broker
- `id_broker3` (opcional): ID del tercer broker
- `porcentaje_broker3` (opcional): Porcentaje del tercer broker

---

## 🏛️ Razones Sociales

**Base URL:** `/api/razones-sociales`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/razones-sociales` | Obtener todas las razones sociales | Autenticado |
| `GET` | `/razones-sociales/con-esquemas` | Obtener todas las razones sociales con sus esquemas | Autenticado |
| `GET` | `/razones-sociales/:id` | Obtener razón social por ID | Autenticado |
| `GET` | `/razones-sociales/:id/esquemas` | Obtener razón social por ID con sus esquemas | Autenticado |
| `GET` | `/razones-sociales/cliente/:clienteId` | Obtener razones sociales por cliente | Autenticado |
| `GET` | `/razones-sociales/rfc/:rfc` | Buscar razón social por RFC | Autenticado |
| `POST` | `/razones-sociales` | Crear nueva razón social | Autenticado |
| `PUT` | `/razones-sociales/:id` | Actualizar razón social | Autenticado |
| `DELETE` | `/razones-sociales/:id` | Eliminar razón social | Autenticado |

**Campos para crear/actualizar razón social:**
- `id_cliente` (obligatorio): ID del cliente relacionado
- `razon_social` (obligatorio): Nombre de la razón social
- `rfc` (obligatorio): RFC de la razón social (12-13 caracteres)
- `regimen_fiscal` (obligatorio): Régimen fiscal
- `codigo_postal` (obligatorio): Código postal
- `calle` (opcional): Calle de la dirección
- `numero_interior` (opcional): Número interior
- `numero_exterior` (opcional): Número exterior
- `colonia` (opcional): Colonia
- `ciudad` (opcional): Ciudad
- `estado` (opcional): Estado
- `forma_pago` (opcional): Forma de pago
- `metodo_pago` (opcional): Método de pago
- `uso_cfdi` (opcional): Uso de CFDI

---

## 🏦 Brokers

**Base URL:** `/api/brokers`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/brokers` | Obtener todos los brokers (incluye saldo pendiente) | Autenticado |
| `GET` | `/brokers/:id` | Obtener broker por ID (incluye saldo pendiente) | Autenticado |
| `GET` | `/brokers/porcentaje-range` | Obtener brokers por rango de porcentaje | Autenticado |
| `GET` | `/brokers/letter/:letter` | Buscar brokers por letra (incluye saldo pendiente) | Autenticado |
| `POST` | `/brokers` | Crear nuevo broker | `ADMINISTRACION` |
| `PUT` | `/brokers/:id` | Actualizar broker | `ADMINISTRACION` |
| `DELETE` | `/brokers/:id` | Eliminar broker | `ADMINISTRACION` |

**Ejemplo de respuesta con saldo pendiente:**
```json
{
  "id": 1,
  "nombre": "Broker Ejemplo",
  "saldo_pendiente": 15000.50
}
```

**Nota sobre el saldo pendiente:**
- El campo `saldo_pendiente` representa la suma total de todas las comisiones en estado `PENDIENTE` para ese broker
- Se calcula automáticamente en tiempo real
- Si el broker no tiene comisiones pendientes, el saldo será `0`

---

## 💼 Operaciones

**Base URL:** `/api/operaciones`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/operaciones` | Obtener todas las operaciones | Autenticado |
| `GET` | `/operaciones/no-completamente-pagadas` | Obtener operaciones con saldo pendiente (saldo > 0) | Autenticado |
| `GET` | `/operaciones/:id` | Obtener operación por ID (incluye conceptos de factura y razón social) | Autenticado |
| `POST` | `/operaciones` | Crear nueva operación (con soporte para imagen, conceptos de factura y comisiones de broker automáticas) | `ADMINISTRACION`, `FACTURACION` |
| `PUT` | `/operaciones/:id` | Actualizar operación (con soporte para imagen) | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/operaciones/:id` | Eliminar operación | `ADMINISTRACION` |
| `POST` | `/operaciones/:id/imagen` | Subir imagen para una operación | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/operaciones/:id/imagen` | Eliminar imagen de una operación | `ADMINISTRACION`, `FACTURACION` |
| `POST` | `/operaciones/:id/recalcular-saldo` | Recalcular saldo de una operación | `ADMINISTRACION`, `FACTURACION` |

**Endpoint especial: Operaciones no completamente pagadas**
- **URL:** `GET /api/operaciones/no-completamente-pagadas`
- **Descripción:** Obtiene todas las operaciones que tienen saldo pendiente (saldo > 0)
- **Respuesta:** Array directo de operaciones con información completa incluyendo nombres de cliente, empresa y brokers
- **Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "numero_operacion": "OP001",
    "deposito": 50000.00,
    "saldo": 15000.00,
    "nombre_cliente": "Cliente Ejemplo",
    "nombre_empresa": "Empresa Ejemplo",
    "fecha_operacion": "2024-01-15",
    "estatus": "PENDIENTE"
  },
  {
    "id": 2,
    "numero_operacion": "OP002",
    "deposito": 30000.00,
    "saldo": 5000.00,
    "nombre_cliente": "Otro Cliente",
    "nombre_empresa": "Otra Empresa",
    "fecha_operacion": "2024-01-16",
    "estatus": "PENDIENTE"
  }
]
```

**Notas sobre imágenes:**
- Las imágenes se almacenan en la carpeta `uploads/` del servidor
- Se sirven estáticamente en `/uploads/` 
- Formatos permitidos: JPG, PNG, GIF, WebP
- Tamaño máximo: 5MB
- **La API asigna automáticamente la ruta de la imagen** - el usuario solo envía el archivo

**Crear/Actualizar operación con imagen:**
- **Content-Type:** `multipart/form-data`
- **Campos:** Todos los campos de operación + `imagen` (opcional) + `estatus` (opcional)
- **Estatus válidos:** `PENDIENTE` (por defecto), `PREVIA`, `FACTURADA`
- **Nota:** El usuario solo envía el archivo de imagen, la API se encarga de asignar la ruta automáticamente
- **Ejemplo:**
  ```bash
  curl -X POST \
    http://localhost:3000/api/operaciones \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -F "id_cliente=1" \
    -F "tipo_esquema=FACTURA" \
    -F "porcentaje_esquema=10.50" \
    -F "deposito=50000.00" \
    -F "id_empresa=1" \
    -F "fecha_operacion=2024-01-15" \
    -F "estatus=PENDIENTE" \
    -F "imagen=@/path/to/image.jpg"
  ```

**Ejemplo de creación con estatus:**
```json
{
  "id_cliente": 1,
  "tipo_esquema": "FACTURA",
  "porcentaje_esquema": 10.50,
  "deposito": 50000.00,
  "id_empresa": 1,
  "fecha_operacion": "2024-01-15",
  "estatus": "PENDIENTE",
  "id_broker1": 1,
  "porcentaje_broker1": 5.0,
  "id_broker2": 2,
  "porcentaje_broker2": 3.0,
  "conceptos_factura": [
    {
      "descripcion": "Servicio de consultoría",
      "clave_sat": "84111506",
      "clave_unidad": "H87",
      "cantidad": 10.0,
      "precio_unitario": 1500.00
    }
  ]
}
```

**Respuesta de creación (incluye comisiones automáticas):**
```json
{
  "message": "Operación creada exitosamente con 1 concepto(s) de factura y 2 comisión(es) de broker",
  "operacion": {
    "id": 1,
    "numero_operacion": "OP001",
    "deposito": 50000.00,
    "id_broker1": 1,
    "porcentaje_broker1": 5.0,
    "id_broker2": 2,
    "porcentaje_broker2": 3.0,
    "conceptos_factura": [
      {
        "id": 1,
        "descripcion": "Servicio de consultoría",
        "clave_sat": "84111506",
        "clave_unidad": "H87",
        "cantidad": 10.0,
        "precio_unitario": 1500.00
      }
    ],
    "comisiones_broker": [
      {
        "id": 1,
        "id_broker": 1,
        "id_operacion": 1,
        "comision": 2500.00,
        "estatus": "PENDIENTE",
        "metodo_pago": null,
        "nombre_broker": "Broker 1"
      },
      {
        "id": 2,
        "id_broker": 2,
        "id_operacion": 1,
        "comision": 1500.00,
        "estatus": "PENDIENTE",
        "metodo_pago": null,
        "nombre_broker": "Broker 2"
      }
    ]
  }
}
```

**Nota sobre comisiones automáticas:**
- Las comisiones se calculan automáticamente según el campo `costo`:
  - Si `costo = 'TOTAL'`: `(deposito * porcentaje_esquema) * porcentaje_broker`
  - Si `costo = 'SUBTOTAL'`: `((deposito / 1.16) * porcentaje_esquema) * porcentaje_broker`
- Se crean solo si hay `deposito > 0` y `porcentaje_broker > 0`
- Estado inicial: `PENDIENTE`
- Método de pago inicial: `null` (se debe asignar posteriormente)
- Se crean para broker1, broker2 y broker3 según corresponda

---

## 📋 Conceptos de Factura

**Base URL:** `/api/conceptos-factura`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/conceptos-factura` | Obtener todos los conceptos de factura | Autenticado |
| `GET` | `/conceptos-factura/:id` | Obtener concepto de factura por ID | Autenticado |
| `GET` | `/conceptos-factura/operacion/:idOperacion` | Obtener conceptos de factura por operación | Autenticado |
| `GET` | `/conceptos-factura/operacion/:idOperacion/estadisticas` | Obtener estadísticas de conceptos por operación | Autenticado |
| `GET` | `/conceptos-factura/por-clave-sat` | Obtener conceptos agrupados por clave SAT | Autenticado |
| `GET` | `/conceptos-factura/por-clave-unidad` | Obtener conceptos agrupados por clave de unidad | Autenticado |
| `POST` | `/conceptos-factura` | Crear nuevo concepto de factura | `ADMINISTRACION`, `FACTURACION` |
| `PUT` | `/conceptos-factura/:id` | Actualizar concepto de factura | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/conceptos-factura/:id` | Eliminar concepto de factura | `ADMINISTRACION` |
| `DELETE` | `/conceptos-factura/operacion/:idOperacion` | Eliminar todos los conceptos de una operación | `ADMINISTRACION` |

**Campos del concepto de factura:**
- `id_operacion` (requerido): ID de la operación relacionada
- `descripcion` (requerido): Descripción del concepto
- `clave_sat` (requerido): Clave SAT del producto/servicio
- `clave_unidad` (requerido): Clave de unidad de medida SAT
- `cantidad` (requerido): Cantidad del concepto (decimal positivo)
- `precio_unitario` (requerido): Precio unitario (decimal positivo)

**Ejemplo de creación de concepto:**
```json
{
  "id_operacion": 1,
  "descripcion": "Servicio de consultoría",
  "clave_sat": "84111506",
  "clave_unidad": "H87",
  "cantidad": 10.0,
  "precio_unitario": 1500.00
}
```

**Crear operación con conceptos de factura:**
```json
{
  "id_cliente": 1,
  "tipo_esquema": "FACTURA",
  "porcentaje_esquema": 10.50,
  "deposito": 50000.00,
  "id_empresa": 1,
  "fecha_operacion": "2024-01-15",
  "conceptos_factura": [
    {
      "descripcion": "Servicio de consultoría",
      "clave_sat": "84111506",
      "clave_unidad": "H87",
      "cantidad": 10.0,
      "precio_unitario": 1500.00
    },
    {
      "descripcion": "Desarrollo de software",
      "clave_sat": "84111506",
      "clave_unidad": "H87",
      "cantidad": 5.0,
      "precio_unitario": 2000.00
    }
  ]
}
```

---

## 💰 Comisión Broker

**Base URL:** `/api/comision-broker`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/comision-broker` | Obtener todas las comisiones de broker | Autenticado |
| `GET` | `/comision-broker/:id` | Obtener comisión de broker por ID | Autenticado |
| `GET` | `/comision-broker/broker/:idBroker` | Obtener comisiones por broker | Autenticado |
| `GET` | `/comision-broker/broker/:idBroker/estadisticas` | Obtener estadísticas de comisiones por broker | Autenticado |
| `GET` | `/comision-broker/operacion/:idOperacion` | Obtener comisiones por operación | Autenticado |
| `GET` | `/comision-broker/estatus/:estatus` | Obtener comisiones por estatus (PENDIENTE, PAGADA, CANCELADA) | Autenticado |
| `GET` | `/comision-broker/pendientes` | Obtener comisiones pendientes | Autenticado |
| `GET` | `/comision-broker/pagadas` | Obtener comisiones pagadas | Autenticado |
| `GET` | `/comision-broker/canceladas` | Obtener comisiones canceladas | Autenticado |
| `GET` | `/comision-broker/estadisticas-generales` | Obtener estadísticas generales de comisiones | Autenticado |
| `GET` | `/comision-broker/rango-fechas?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD` | Obtener comisiones por rango de fechas | Autenticado |
| `POST` | `/comision-broker` | Crear nueva comisión de broker | `ADMINISTRACION`, `FACTURACION` |
| `PUT` | `/comision-broker/:id` | Actualizar comisión de broker | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/comision-broker/:id` | Eliminar comisión de broker | `ADMINISTRACION` |
| `DELETE` | `/comision-broker/operacion/:idOperacion` | Eliminar todas las comisiones de una operación | `ADMINISTRACION` |

**Campos de la comisión de broker:**
- `id_broker` (requerido): ID del broker relacionado
- `id_operacion` (requerido): ID de la operación relacionada
- `comision` (requerido): Monto de la comisión (decimal positivo)
- `estatus` (opcional): Estado de la comisión - `PENDIENTE` (por defecto), `PAGADA`, `CANCELADA`
- `metodo_pago` (opcional): Método de pago - `TRANSFERENCIA` (por defecto), `EFECTIVO`
- `fecha_pago` (opcional): Fecha de pago (YYYY-MM-DD)

**Ejemplo de creación de comisión:**
```json
{
  "id_broker": 1,
  "id_operacion": 1,
  "comision": 1500.00,
  "estatus": "PENDIENTE",
  "metodo_pago": "TRANSFERENCIA",
  "fecha_pago": "2024-01-15"
}
```

**Ejemplo de respuesta:**
```json
{
  "message": "Comisión de broker creada exitosamente",
  "comision": {
    "id": 1,
    "id_broker": 1,
    "id_operacion": 1,
    "comision": 1500.00,
    "estatus": "PENDIENTE",
    "metodo_pago": "TRANSFERENCIA",
    "fecha_pago": "2024-01-15",
    "nombre_broker": "Broker Ejemplo",
    "numero_operacion": "OP001",
    "folio_factura": "F001",
    "fecha_operacion": "2024-01-15",
    "nombre_cliente": "Cliente Ejemplo",
    "nombre_empresa": "Empresa Ejemplo",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Estadísticas de comisiones por broker:**
```json
{
  "total_comisiones": 25,
  "comisiones_pendientes": 10,
  "comisiones_pagadas": 12,
  "comisiones_canceladas": 3,
  "total_comision": 37500.00,
  "total_pagado": 18000.00,
  "total_pendiente": 15000.00
}
```

---

## 🏛️ Bancos

**Base URL:** `/api/bancos`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/bancos` | Obtener todos los bancos | Autenticado |
| `GET` | `/bancos/:id` | Obtener banco por ID | Autenticado |
| `GET` | `/bancos/stats` | Obtener estadísticas de bancos | Autenticado |
| `GET` | `/bancos/empresa/:empresaId` | Obtener bancos por empresa | Autenticado |
| `GET` | `/bancos/search/:nombre` | Buscar bancos por nombre | Autenticado |
| `GET` | `/bancos/clabe/:clabe` | Obtener banco por CLABE | Autenticado |
| `POST` | `/bancos` | Crear nuevo banco | `ADMINISTRACION` |
| `PUT` | `/bancos/:id` | Actualizar banco | `ADMINISTRACION` |
| `DELETE` | `/bancos/:id` | Eliminar banco | `ADMINISTRACION` |

---

## 💰 Movimientos Bancarios

**Base URL:** `/api/movimientos-bancarios`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/movimientos-bancarios` | Obtener todos los movimientos | Autenticado |
| `GET` | `/movimientos-bancarios/:id` | Obtener movimiento por ID | Autenticado |
| `GET` | `/movimientos-bancarios/stats` | Obtener estadísticas de movimientos | Autenticado |
| `GET` | `/movimientos-bancarios/resumen-banco` | Obtener resumen por banco | Autenticado |
| `GET` | `/movimientos-bancarios/hoy` | Obtener movimientos del día | Autenticado |
| `GET` | `/movimientos-bancarios/mes-actual` | Obtener movimientos del mes actual | Autenticado |
| `GET` | `/movimientos-bancarios/banco/:bancoId` | Obtener movimientos por banco | Autenticado |
| `GET` | `/movimientos-bancarios/empresa/:empresaId` | Obtener movimientos por empresa | Autenticado |
| `GET` | `/movimientos-bancarios/fecha/:fecha` | Obtener movimientos por fecha | Autenticado |
| `GET` | `/movimientos-bancarios/rango/:fecha_desde/:fecha_hasta` | Obtener movimientos por rango de fechas | Autenticado |
| `GET` | `/movimientos-bancarios/usuario/:usuarioId` | Obtener movimientos por usuario | Autenticado |
| `GET` | `/movimientos-bancarios/factura/:facturaId` | Obtener movimientos por factura | Autenticado |
| `GET` | `/movimientos-bancarios/search/:descripcion` | Buscar movimientos por descripción | Autenticado |
| `POST` | `/movimientos-bancarios` | Crear nuevo movimiento | `ADMINISTRACION`, `CONTADOR` |
| `PUT` | `/movimientos-bancarios/:id` | Actualizar movimiento | `ADMINISTRACION`, `CONTADOR` |
| `DELETE` | `/movimientos-bancarios/:id` | Eliminar movimiento | `ADMINISTRACION` |

---

## 📄 Facturas

**Base URL:** `/api/facturas`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/facturas` | Obtener todas las facturas | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/facturas/:id` | Obtener factura por ID | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/facturas/stats` | Obtener estadísticas de facturas | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/facturas/uuid/:uuid` | Obtener factura por UUID | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/facturas/folio/:folio` | Obtener factura por folio | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/facturas/empresa/:id_empresa` | Obtener facturas por empresa | `ADMINISTRACION`, `FACTURACION` |
| `POST` | `/facturas` | Crear nueva factura | `ADMINISTRACION`, `FACTURACION` |
| `PUT` | `/facturas/:id` | Actualizar factura | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/facturas/:id` | Eliminar factura | `ADMINISTRACION` |

---

## 🔗 Factura-Movimiento Bancario

**Base URL:** `/api/factura-movimiento-bancario`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/factura-movimiento-bancario` | Obtener todas las asignaciones | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/factura-movimiento-bancario/:id` | Obtener asignación específica | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/factura-movimiento-bancario/factura/:id_factura` | Obtener movimientos de una factura | `ADMINISTRACION`, `FACTURACION` |
| `GET` | `/factura-movimiento-bancario/movimiento/:id_movimiento_bancario` | Obtener facturas de un movimiento | `ADMINISTRACION`, `FACTURACION` |
| `POST` | `/factura-movimiento-bancario` | Asignar movimiento a factura | `ADMINISTRACION`, `FACTURACION` |
| `PUT` | `/factura-movimiento-bancario/:id` | Actualizar monto asignado | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/factura-movimiento-bancario/:id` | Eliminar asignación | `ADMINISTRACION` |

---

## 💸 Aplicación de Pagos

**Base URL:** `/api/aplicacion-pagos`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/aplicacion-pagos` | Obtener todas las aplicaciones | Autenticado |
| `GET` | `/aplicacion-pagos/:id` | Obtener aplicación por ID | Autenticado |
| `GET` | `/aplicacion-pagos/operacion/:idOperacion` | Obtener aplicaciones por operación | Autenticado |
| `GET` | `/aplicacion-pagos/movimiento/:idMovimiento` | Obtener aplicaciones por movimiento | Autenticado |
| `GET` | `/aplicacion-pagos/estadisticas/operacion/:idOperacion` | Obtener estadísticas por operación | Autenticado |
| `GET` | `/aplicacion-pagos/fechas/rango` | Obtener aplicaciones por rango de fechas | Autenticado |
| `GET` | `/aplicacion-pagos/movimiento/:idMovimiento/estado` | Verificar estado de aplicación | Autenticado |
| `POST` | `/aplicacion-pagos` | Crear nueva aplicación | `ADMINISTRACION`, `FACTURACION` |
| `PUT` | `/aplicacion-pagos/:id` | Actualizar aplicación | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/aplicacion-pagos/:id` | Eliminar aplicación | `ADMINISTRACION` |

---

## 🔄 Retornos

**Base URL:** `/api/retornos`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/retornos` | Obtener todos los retornos | Autenticado |
| `GET` | `/retornos/:id` | Obtener retorno por ID | Autenticado |
| `GET` | `/retornos/operacion/:idOperacion` | Obtener retornos por operación | Autenticado |
| `GET` | `/retornos/estadisticas/operacion/:idOperacion` | Obtener estadísticas por operación | Autenticado |
| `GET` | `/retornos/fechas/rango` | Obtener retornos por rango de fechas | Autenticado |
| `POST` | `/retornos` | Crear nuevo retorno (con soporte para imagen de comprobante) | `ADMINISTRACION`, `FACTURACION` |
| `PUT` | `/retornos/:id` | Actualizar retorno (con soporte para imagen de comprobante) | `ADMINISTRACION`, `FACTURACION` |
| `DELETE` | `/retornos/:id` | Eliminar retorno | `ADMINISTRACION` |

**Campos del retorno:**
- `id_operacion` (requerido): ID de la operación relacionada
- `fecha_pago` (requerido): Fecha del pago (YYYY-MM-DD)
- `monto_pagado` (requerido): Monto pagado (decimal positivo)
- `metodo_pago` (requerido): Método de pago - `EFECTIVO`, `TRANSFERENCIA`, `CHEQUE`, `TARJETA`, `DEPOSITO`
- `referencia` (opcional): Referencia o número de comprobante de pago
- `imagen` (opcional): Archivo de imagen del comprobante de pago

**Notas sobre imágenes de comprobante:**
- Las imágenes se almacenan en la carpeta `uploads/` del servidor
- Se sirven estáticamente en `/uploads/` 
- Formatos permitidos: JPG, PNG, GIF, WebP
- Tamaño máximo: 5MB
- **La API asigna automáticamente la ruta de la imagen** - el usuario solo envía el archivo

**Crear/Actualizar retorno con imagen:**
- **Content-Type:** `multipart/form-data`
- **Campos:** Todos los campos de retorno + `imagen` (opcional)
- **Ejemplo:**
  ```bash
  curl -X POST \
    http://localhost:3000/api/retornos \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -F "id_operacion=1" \
    -F "fecha_pago=2024-01-15" \
    -F "monto_pagado=5000.00" \
    -F "metodo_pago=TRANSFERENCIA" \
    -F "referencia=TRF123456789" \
    -F "imagen=@/path/to/comprobante.jpg"
  ```

**Ejemplo de creación de retorno:**
```json
{
  "id_operacion": 1,
  "fecha_pago": "2024-01-15",
  "monto_pagado": 5000.00,
  "metodo_pago": "TRANSFERENCIA",
  "referencia": "TRF123456789"
}
```

**Ejemplo de respuesta:**
```json
{
  "message": "Retorno creado exitosamente",
  "retorno": {
    "id_retorno": 1,
    "id_operacion": 1,
    "fecha_pago": "2024-01-15",
    "monto_pagado": 5000.00,
    "metodo_pago": "TRANSFERENCIA",
    "referencia": "TRF123456789",
    "comprobante_pago": "/uploads/comprobante-123456789.jpg",
    "fecha_creacion": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🏖️ Vacaciones

**Base URL:** `/api/vacaciones`

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/vacaciones` | Obtener todas las vacaciones | `ADMINISTRACION` |
| `GET` | `/vacaciones/usuario/:id` | Obtener vacaciones por usuario | Autenticado |

---

## 📊 Endpoints Generales

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| `GET` | `/status` | Estado de la API | Autenticado |
| `POST` | `/echo` | Endpoint de prueba | Autenticado |

---

## 📝 Notas Importantes

### Autenticación
- Todos los endpoints requieren autenticación JWT excepto los de autenticación pública
- El token debe enviarse en el header: `Authorization: Bearer <token>`

### Roles y Permisos
- `ADMINISTRACION`: Acceso completo a todos los endpoints
- `FACTURACION`: Acceso a facturación, pagos y retornos
- `CONTADOR`: Acceso a movimientos bancarios
- Usuarios regulares: Acceso limitado a su propia información

### Parámetros de Consulta
Muchos endpoints soportan parámetros de consulta para filtrado y paginación:
- `page`: Número de página
- `limit`: Elementos por página
- `search`: Término de búsqueda
- `sort`: Campo de ordenamiento
- `order`: Dirección del ordenamiento (ASC/DESC)

### Respuestas
Todas las respuestas siguen un formato estándar:
```json
{
  "success": true,
  "data": {...},
  "message": "Operación exitosa"
}
```

### Códigos de Error
- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - No autenticado
- `403`: Forbidden - Sin permisos
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor 
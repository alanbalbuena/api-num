-- Script de prueba para crear esquemas de ejemplo
-- Este script crea esquemas para las razones sociales que insertamos anteriormente

-- Esquema 1: FACTURA para Empresas Mexicanas del Norte
INSERT INTO esquema (
  id_razon_social,
  tipo_esquema, 
  porcentaje_esquema,
  costo,
  id_broker1, 
  porcentaje_broker1,
  id_broker2, 
  porcentaje_broker2,
  id_broker3, 
  porcentaje_broker3
) VALUES (
  1, 'FACTURA', 10.5, 'TOTAL', 1, 5.0, 2, 3.5, NULL, NULL
);

-- Esquema 2: COMISION para Industrias Tecnológicas Avanzadas
INSERT INTO esquema (
  id_razon_social,
  tipo_esquema, 
  porcentaje_esquema,
  costo,
  id_broker1, 
  porcentaje_broker1,
  id_broker2, 
  porcentaje_broker2,
  id_broker3, 
  porcentaje_broker3
) VALUES (
  2, 'COMISION', 8.0, 'TOTAL', 3, 4.0, NULL, NULL, NULL, NULL
);

-- Esquema 3: FACTURA para Comercio Internacional del Pacífico
INSERT INTO esquema (
  id_razon_social,
  tipo_esquema, 
  porcentaje_esquema,
  costo,
  id_broker1, 
  porcentaje_broker1,
  id_broker2, 
  porcentaje_broker2,
  id_broker3, 
  porcentaje_broker3
) VALUES (
  3, 'FACTURA', 12.0, 'TOTAL', 2, 6.0, 1, 4.0, 3, 2.0
);

-- Esquema 4: COMISION para Construcciones Metropolitanas
INSERT INTO esquema (
  id_razon_social,
  tipo_esquema, 
  porcentaje_esquema,
  costo,
  id_broker1, 
  porcentaje_broker1,
  id_broker2, 
  porcentaje_broker2,
  id_broker3, 
  porcentaje_broker3
) VALUES (
  4, 'COMISION', 7.5, 'TOTAL', 1, 3.5, NULL, NULL, NULL, NULL
);

-- Esquema 5: FACTURA para Servicios Financieros Integrales
INSERT INTO esquema (
  id_razon_social,
  tipo_esquema, 
  porcentaje_esquema,
  costo,
  id_broker1, 
  porcentaje_broker1,
  id_broker2, 
  porcentaje_broker2,
  id_broker3, 
  porcentaje_broker3
) VALUES (
  5, 'FACTURA', 15.0, 'TOTAL', 3, 7.5, 2, 5.0, 1, 2.5
);

-- Verificar que se insertaron correctamente
SELECT 'Se insertaron 5 esquemas de ejemplo' AS mensaje;
SELECT COUNT(*) AS total_esquemas FROM esquema;
SELECT 
  e.id,
  e.tipo_esquema,
  e.porcentaje_esquema,
  rs.razon_social,
  c.nombre as cliente
FROM esquema e
JOIN razon_social rs ON e.id_razon_social = rs.id
JOIN cliente c ON rs.id_cliente = c.id
ORDER BY e.id;

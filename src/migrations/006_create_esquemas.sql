-- Crear tabla esquema si no existe
CREATE TABLE IF NOT EXISTS esquema (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_razon_social INT NULL,
  tipo_esquema ENUM('FACTURA', 'SINDICATO', 'SAPI', 'C909', 'BANCARIZACION', 'CONTABILIDAD'),
  porcentaje_esquema DECIMAL(10,2),
  costo ENUM('TOTAL', 'SUBTOTAL') NOT NULL DEFAULT 'TOTAL',
  id_broker1 INT NULL,
  porcentaje_broker1  DECIMAL(10,2),
  id_broker2 INT NULL,
  porcentaje_broker2 DECIMAL(10,2),
  id_broker3 INT NULL,
  porcentaje_broker3 DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_broker1) REFERENCES broker(id) ON DELETE CASCADE,
  FOREIGN KEY (id_broker2) REFERENCES broker(id) ON DELETE CASCADE,
  FOREIGN KEY (id_broker3) REFERENCES broker(id) ON DELETE CASCADE,
  FOREIGN KEY (id_razon_social) REFERENCES razon_social(id) ON DELETE CASCADE


); 
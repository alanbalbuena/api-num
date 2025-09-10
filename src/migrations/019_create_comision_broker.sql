-- Crear tabla comision_broker si no existe
CREATE TABLE IF NOT EXISTS comision_broker (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_broker INT NOT NULL,
  id_operacion INT NOT NULL,
  comision DECIMAL(10,2) NOT NULL,
  estatus ENUM('PENDIENTE', 'PAGADA', 'CANCELADA') DEFAULT 'PENDIENTE',
  metodo_pago ENUM('TRANSFERENCIA', 'EFECTIVO') NULL,
  fecha_pago DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_broker) REFERENCES broker(id) ON DELETE CASCADE,
  FOREIGN KEY (id_operacion) REFERENCES operaciones(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_comision_broker_broker ON comision_broker(id_broker);
CREATE INDEX idx_comision_broker_operacion ON comision_broker(id_operacion);
CREATE INDEX idx_comision_broker_estatus ON comision_broker(estatus);
CREATE INDEX idx_comision_broker_fecha_pago ON comision_broker(fecha_pago);
CREATE INDEX idx_comision_broker_metodo_pago ON comision_broker(metodo_pago);

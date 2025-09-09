-- Crear tabla conceptos_factura si no existe
CREATE TABLE IF NOT EXISTS conceptos_factura (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_operacion INT NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  clave_sat VARCHAR(20) NOT NULL,
  clave_unidad VARCHAR(10) NOT NULL,
  cantidad DECIMAL(10,4) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_operacion) REFERENCES operaciones(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_conceptos_factura_operacion ON conceptos_factura(id_operacion);
CREATE INDEX idx_conceptos_factura_clave_sat ON conceptos_factura(clave_sat);
CREATE INDEX idx_conceptos_factura_clave_unidad ON conceptos_factura(clave_unidad);

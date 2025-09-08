-- Crear tabla razon_social si no existe
CREATE TABLE IF NOT EXISTS razon_social (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  razon_social VARCHAR(255) NOT NULL,
  rfc VARCHAR(13) NOT NULL,
  regimen_fiscal VARCHAR(100) NOT NULL,
  calle VARCHAR(255) NOT NULL,
  numero_interior VARCHAR(10) NULL,
  numero_exterior VARCHAR(10) NOT NULL,
  colonia VARCHAR(255) NOT NULL,
  codigo_postal VARCHAR(10) NOT NULL,
  ciudad VARCHAR(255) NOT NULL,
  estado VARCHAR(255) NOT NULL,
  forma_pago VARCHAR(100) NULL ,
  metodo_pago VARCHAR(100) NULL ,
  uso_cfdi VARCHAR(100) NULL ,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_razon_social_cliente ON razon_social(id_cliente);
CREATE INDEX idx_razon_social_rfc ON razon_social(rfc);
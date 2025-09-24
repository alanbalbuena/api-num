CREATE TABLE retornos (
    id_retorno SERIAL PRIMARY KEY,
    id_operacion INTEGER NOT NULL,
    fecha_pago DATE NOT NULL,
    monto_pagado DECIMAL(15,2) NOT NULL,
    metodo_pago ENUM('EFECTIVO', 'TRANSFERENCIA') NOT NULL,
    referencia VARCHAR(255) NULL,
    comprobante_pago VARCHAR(500) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Llave foránea explícita
    CONSTRAINT fk_retorno_operacion FOREIGN KEY (id_operacion) REFERENCES operaciones(id) ON DELETE CASCADE,
    
    -- Restricciones adicionales
    CONSTRAINT chk_monto_pagado_positivo CHECK (monto_pagado > 0)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_retorno_id_operacion ON retornos(id_operacion);
CREATE INDEX idx_retorno_fecha_pago ON retornos(fecha_pago);
CREATE INDEX idx_retorno_metodo_pago ON retornos(metodo_pago);
CREATE INDEX idx_retorno_fecha_creacion ON retornos(fecha_creacion);

-- Trigger para actualizar la fecha de actualización automáticamente
DELIMITER $$
CREATE TRIGGER before_retorno_update
BEFORE UPDATE ON retornos
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
END$$
DELIMITER ; 
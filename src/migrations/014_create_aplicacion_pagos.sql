CREATE TABLE aplicacion_pagos (
    id SERIAL PRIMARY KEY,
    id_operacion INTEGER NOT NULL,
    id_deposito INTEGER NOT NULL,
    monto_aplicado DECIMAL(15,2) NOT NULL,
    fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Llaves foráneas explícitas
    CONSTRAINT fk_ap_operacion FOREIGN KEY (id_operacion) REFERENCES operaciones(id) ON DELETE CASCADE,
    CONSTRAINT fk_ap_deposito FOREIGN KEY (id_deposito) REFERENCES movimientos_bancarios(id) ON DELETE CASCADE,
    
    -- Restricciones adicionales
    CONSTRAINT chk_monto_aplicado_positivo CHECK (monto_aplicado > 0),
    
    -- Restricción única para evitar duplicados
    CONSTRAINT uk_operacion_deposito UNIQUE (id_operacion, id_deposito)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_ap_id_operacion ON aplicacion_pagos(id_operacion);
CREATE INDEX idx_ap_id_deposito ON aplicacion_pagos(id_deposito);
CREATE INDEX idx_ap_fecha_aplicacion ON aplicacion_pagos(fecha_aplicacion);

-- Trigger para actualizar el saldo de la operación cuando se aplica un pago
DELIMITER $$
CREATE TRIGGER after_aplicacion_pago_insert
AFTER INSERT ON aplicacion_pagos
FOR EACH ROW
BEGIN
    DECLARE total_aplicado DECIMAL(15,2);
    
    -- Calcular el total aplicado a la operación
    SELECT COALESCE(SUM(monto_aplicado), 0) INTO total_aplicado
    FROM aplicacion_pagos
    WHERE id_operacion = NEW.id_operacion;
    
    -- Actualizar el saldo en la operación
    UPDATE operaciones 
    SET saldo = deposito - total_aplicado
    WHERE id = NEW.id_operacion;
END$$
DELIMITER ;

-- Trigger para actualizar el saldo cuando se actualiza una aplicación de pago
DELIMITER $$
CREATE TRIGGER after_aplicacion_pago_update
AFTER UPDATE ON aplicacion_pagos
FOR EACH ROW
BEGIN
    DECLARE total_aplicado DECIMAL(15,2);
    
    -- Calcular el total aplicado a la operación
    SELECT COALESCE(SUM(monto_aplicado), 0) INTO total_aplicado
    FROM aplicacion_pagos
    WHERE id_operacion = NEW.id_operacion;
    
    -- Actualizar el saldo en la operación
    UPDATE operaciones 
    SET saldo = deposito - total_aplicado
    WHERE id = NEW.id_operacion;
END$$
DELIMITER ;

-- Trigger para actualizar el saldo cuando se elimina una aplicación de pago
DELIMITER $$
CREATE TRIGGER after_aplicacion_pago_delete
AFTER DELETE ON aplicacion_pagos
FOR EACH ROW
BEGIN
    DECLARE total_aplicado DECIMAL(15,2);
    
    -- Calcular el total aplicado a la operación después de la eliminación
    SELECT COALESCE(SUM(monto_aplicado), 0) INTO total_aplicado
    FROM aplicacion_pagos
    WHERE id_operacion = OLD.id_operacion;
    
    -- Actualizar el saldo en la operación
    UPDATE operaciones 
    SET saldo = deposito - total_aplicado
    WHERE id = OLD.id_operacion;
END$$
DELIMITER ; 
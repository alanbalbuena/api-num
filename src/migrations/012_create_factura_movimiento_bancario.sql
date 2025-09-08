CREATE TABLE factura_movimiento_bancario (
    id SERIAL PRIMARY KEY,
    id_factura INTEGER NOT NULL,
    id_movimiento_bancario INTEGER NOT NULL,
    monto_asignado DECIMAL(15,2) NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Llaves foráneas explícitas
    CONSTRAINT fk_fmb_factura FOREIGN KEY (id_factura) REFERENCES facturas(id) ON DELETE CASCADE,
    CONSTRAINT fk_fmb_movimiento_bancario FOREIGN KEY (id_movimiento_bancario) REFERENCES movimientos_bancarios(id) ON DELETE CASCADE,
    
    -- Restricción única para evitar duplicados
    CONSTRAINT uk_factura_movimiento UNIQUE (id_factura, id_movimiento_bancario)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_fmb_id_factura ON factura_movimiento_bancario(id_factura);
CREATE INDEX idx_fmb_id_movimiento_bancario ON factura_movimiento_bancario(id_movimiento_bancario);
CREATE INDEX idx_fmb_fecha_asignacion ON factura_movimiento_bancario(fecha_asignacion);

-- Trigger para actualizar el estado de la factura cuando se asigna un movimiento bancario
DELIMITER $$
CREATE TRIGGER after_factura_movimiento_insert
AFTER INSERT ON factura_movimiento_bancario
FOR EACH ROW
BEGIN
    DECLARE total_asignado DECIMAL(15,2);
    DECLARE total_factura DECIMAL(15,2);
    
    -- Calcular el total asignado a la factura
    SELECT COALESCE(SUM(monto_asignado), 0) INTO total_asignado
    FROM factura_movimiento_bancario
    WHERE id_factura = NEW.id_factura;
    
    -- Obtener el total de la factura
    SELECT total INTO total_factura
    FROM facturas
    WHERE id = NEW.id_factura;
    
    -- Si el total asignado es igual o mayor al total de la factura, marcarla como PAGADA
    IF total_asignado >= total_factura THEN
        UPDATE facturas 
        SET estado = 'PAGADA', updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id_factura;
    END IF;
END$$
DELIMITER ;

-- Trigger para actualizar el estado de la factura cuando se elimina un movimiento bancario
DELIMITER $$
CREATE TRIGGER after_factura_movimiento_delete
AFTER DELETE ON factura_movimiento_bancario
FOR EACH ROW
BEGIN
    DECLARE total_asignado DECIMAL(15,2);
    DECLARE total_factura DECIMAL(15,2);
    
    -- Calcular el total asignado a la factura después de la eliminación
    SELECT COALESCE(SUM(monto_asignado), 0) INTO total_asignado
    FROM factura_movimiento_bancario
    WHERE id_factura = OLD.id_factura;
    
    -- Obtener el total de la factura
    SELECT total INTO total_factura
    FROM facturas
    WHERE id = OLD.id_factura;
    
    -- Si el total asignado es menor al total de la factura, marcarla como PENDIENTE
    IF total_asignado < total_factura THEN
        UPDATE facturas 
        SET estado = 'PENDIENTE', updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.id_factura;
    END IF;
END$$
DELIMITER ; 
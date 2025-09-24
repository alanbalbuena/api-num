CREATE TABLE IF NOT EXISTS operaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_operacion VARCHAR(10) NULL,
  id_cliente INT NULL,
  tipo_esquema ENUM('FACTURA', 'SINDICATO', 'SAPI', 'C909', 'BANCARIZACION', 'CONTABILIDAD'),
  porcentaje_esquema DECIMAL(10,2),
  id_broker1 INT NULL,
  porcentaje_broker1  DECIMAL(10,2),
  id_broker2 INT NULL,
  porcentaje_broker2 DECIMAL(10,2),
  id_broker3 INT NULL,
  porcentaje_broker3 DECIMAL(10,2),
  deposito DECIMAL(10,2),
  id_empresa INT NULL,
  fecha_operacion DATE,
  folio_factura VARCHAR(10) NULL,
  referencia VARCHAR(100) NULL,
  saldo DECIMAL(10,2) DEFAULT 0.00,
  estatus ENUM('PENDIENTE', 'PREVIA', 'FACTURADA') DEFAULT 'PENDIENTE',
  imagen_url VARCHAR(255) NULL,
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  iva DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) DEFAULT 0.00,   
  porcentaje_cms_general DECIMAL(10,2) DEFAULT 0.00,
  cms_general_num DECIMAL(10,2) DEFAULT 0.00,
  fondo_ahorro DECIMAL(10,2) DEFAULT 0.00,  cms_fondo_ahorro_libre DECIMAL(10,2) DEFAULT 0.00,
  cms_hector DECIMAL(10,2) DEFAULT 0.00,
  cms_kuri DECIMAL(10,2) DEFAULT 0.00,  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

  CONSTRAINT fk_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id),
  CONSTRAINT fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id),
  CONSTRAINT fk_id_broker1 FOREIGN KEY (id_broker1) REFERENCES broker(id),
  CONSTRAINT fk_id_broker2 FOREIGN KEY (id_broker2) REFERENCES broker(id),
  CONSTRAINT fk_id_broker3 FOREIGN KEY (id_broker3) REFERENCES broker(id)
); 


-- Crear trigger para calcular automáticamente el saldo al insertar retornos
DELIMITER $$
CREATE TRIGGER after_retorno_insert_update_saldo
AFTER INSERT ON retornos
FOR EACH ROW
BEGIN
    DECLARE total_retornos DECIMAL(15,2);
    DECLARE deposito_operacion DECIMAL(15,2);
    DECLARE porcentaje_esquema_operacion DECIMAL(10,2);
    DECLARE costo_operacion ENUM('SUBTOTAL', 'TOTAL');
    DECLARE saldo_calculado DECIMAL(15,2);
    
    -- Obtener datos de la operación
    SELECT o.deposito, o.porcentaje_esquema, o.costo
    INTO deposito_operacion, porcentaje_esquema_operacion, costo_operacion
    FROM operaciones o
    WHERE o.id = NEW.id_operacion;
    
    -- Calcular el total de retornos para esta operación
    SELECT COALESCE(SUM(monto_pagado), 0) INTO total_retornos
    FROM retornos
    WHERE id_operacion = NEW.id_operacion;
    
    -- Calcular el saldo según la fórmula del costo
    IF costo_operacion = 'TOTAL' THEN
        SET saldo_calculado = (deposito_operacion * (1 - porcentaje_esquema_operacion / 100)) - total_retornos;
    ELSE
        SET saldo_calculado = ((deposito_operacion / 1.16) * (1 - porcentaje_esquema_operacion / 100)) - total_retornos;
    END IF;
    
    -- Actualizar el saldo en la operación
    UPDATE operaciones 
    SET saldo = saldo_calculado
    WHERE id = NEW.id_operacion;
END$$
DELIMITER ;

-- Trigger para cuando se actualiza un retorno
DELIMITER $$
CREATE TRIGGER after_retorno_update_update_saldo
AFTER UPDATE ON retornos
FOR EACH ROW
BEGIN
    DECLARE total_retornos DECIMAL(15,2);
    DECLARE deposito_operacion DECIMAL(15,2);
    DECLARE porcentaje_esquema_operacion DECIMAL(10,2);
    DECLARE costo_operacion ENUM('SUBTOTAL', 'TOTAL');
    DECLARE saldo_calculado DECIMAL(15,2);
    
    -- Obtener datos de la operación
    SELECT o.deposito, o.porcentaje_esquema, o.costo
    INTO deposito_operacion, porcentaje_esquema_operacion, costo_operacion
    FROM operaciones o
    WHERE o.id = NEW.id_operacion;
    
    -- Calcular el total de retornos para esta operación
    SELECT COALESCE(SUM(monto_pagado), 0) INTO total_retornos
    FROM retornos
    WHERE id_operacion = NEW.id_operacion;
    
    -- Calcular el saldo según la fórmula del costo
    IF costo_operacion = 'TOTAL' THEN
        SET saldo_calculado = (deposito_operacion * (1 - porcentaje_esquema_operacion / 100)) - total_retornos;
    ELSE
        SET saldo_calculado = ((deposito_operacion / 1.16) * (1 - porcentaje_esquema_operacion / 100)) - total_retornos;
    END IF;
    
    -- Actualizar el saldo en la operación
    UPDATE operaciones 
    SET saldo = saldo_calculado
    WHERE id = NEW.id_operacion;
END$$
DELIMITER ;

-- Trigger para cuando se elimina un retorno
DELIMITER $$
CREATE TRIGGER after_retorno_delete_update_saldo
AFTER DELETE ON retornos
FOR EACH ROW
BEGIN
    DECLARE total_retornos DECIMAL(15,2);
    DECLARE deposito_operacion DECIMAL(15,2);
    DECLARE porcentaje_esquema_operacion DECIMAL(10,2);
    DECLARE costo_operacion ENUM('SUBTOTAL', 'TOTAL');
    DECLARE saldo_calculado DECIMAL(15,2);
    
    -- Obtener datos de la operación
    SELECT o.deposito, o.porcentaje_esquema, o.costo
    INTO deposito_operacion, porcentaje_esquema_operacion, costo_operacion
    FROM operaciones o
    WHERE o.id = OLD.id_operacion;
    
    -- Calcular el total de retornos para esta operación
    SELECT COALESCE(SUM(monto_pagado), 0) INTO total_retornos
    FROM retornos
    WHERE id_operacion = OLD.id_operacion;
    
    -- Calcular el saldo según la fórmula del costo
    IF costo_operacion = 'TOTAL' THEN
        SET saldo_calculado = (deposito_operacion * (1 - porcentaje_esquema_operacion / 100)) - total_retornos;
    ELSE
        SET saldo_calculado = ((deposito_operacion / 1.16) * (1 - porcentaje_esquema_operacion / 100)) - total_retornos;
    END IF;
    
    -- Actualizar el saldo en la operación
    UPDATE operaciones 
    SET saldo = saldo_calculado
    WHERE id = OLD.id_operacion;
END$$
DELIMITER ;

-- Actualizar saldos existentes para operaciones que ya tienen retornos
-- Primero establecer costo = 'SUBTOTAL' para operaciones existentes
UPDATE operaciones SET costo = 'SUBTOTAL' WHERE costo IS NULL;

-- Luego recalcular saldos con la nueva fórmula
UPDATE operaciones o 
SET saldo = ((o.deposito / 1.16) * (1 - o.porcentaje_esquema / 100)) - COALESCE(
    (SELECT SUM(r.monto_pagado) 
     FROM retornos r 
     WHERE r.id_operacion = o.id), 0
);

-- Trigger para calcular saldo antes de insertar una operación
DELIMITER $$
CREATE TRIGGER before_operacion_insert
BEFORE INSERT ON operaciones
FOR EACH ROW
BEGIN
    DECLARE saldo_calculado DECIMAL(15,2);
    
    -- Calcular el saldo según la fórmula del costo
    IF NEW.costo = 'TOTAL' THEN
        -- Fórmula para TOTAL: (DEPOSITO * (1-PORCENTAJE_ESQUEMA/100))
        SET saldo_calculado = (NEW.deposito * (1 - NEW.porcentaje_esquema / 100));
    ELSE
        -- Fórmula para SUBTOTAL: ((DEPOSITO / 1.16) * (1-PORCENTAJE_ESQUEMA/100))
        SET saldo_calculado = ((NEW.deposito / 1.16) * (1 - NEW.porcentaje_esquema / 100));
    END IF;
    
    -- Establecer el saldo calculado
    SET NEW.saldo = saldo_calculado;
END$$
DELIMITER ;

-- Trigger para calcular saldo antes de actualizar una operación
DELIMITER $$
CREATE TRIGGER before_operacion_update
BEFORE UPDATE ON operaciones
FOR EACH ROW
BEGIN
    DECLARE saldo_calculado DECIMAL(15,2);
    DECLARE total_retornos DECIMAL(15,2);
    
    -- Solo recalcular si se modificaron campos que afectan el cálculo
    IF (NEW.deposito != OLD.deposito) OR 
       (NEW.porcentaje_esquema != OLD.porcentaje_esquema) OR 
       (NEW.costo != OLD.costo) THEN
        
        -- Calcular el saldo base según la fórmula del costo
        IF NEW.costo = 'TOTAL' THEN
            -- Fórmula para TOTAL: (DEPOSITO * (1-PORCENTAJE_ESQUEMA/100))
            SET saldo_calculado = (NEW.deposito * (1 - NEW.porcentaje_esquema / 100));
        ELSE
            -- Fórmula para SUBTOTAL: ((DEPOSITO / 1.16) * (1-PORCENTAJE_ESQUEMA/100))
            SET saldo_calculado = ((NEW.deposito / 1.16) * (1 - NEW.porcentaje_esquema / 100));
        END IF;
        
        -- Obtener el total de retornos aplicados para esta operación
        SELECT COALESCE(SUM(monto_pagado), 0) INTO total_retornos
        FROM retornos
        WHERE id_operacion = NEW.id;
        
        -- Calcular el saldo final restando los retornos
        SET NEW.saldo = saldo_calculado - total_retornos;
    END IF;
END$$
DELIMITER ;

-- Comentarios para documentar los triggers
-- Trigger: before_operacion_insert
-- Descripción: Calcula automáticamente el saldo antes de insertar una nueva operación
-- Fórmula TOTAL: (DEPOSITO * (1-PORCENTAJE_ESQUEMA/100))
-- Fórmula SUBTOTAL: ((DEPOSITO / 1.16) * (1-PORCENTAJE_ESQUEMA/100))

-- Trigger: before_operacion_update  
-- Descripción: Recalcula automáticamente el saldo cuando se actualizan campos que afectan el cálculo
-- Solo se ejecuta si se modifican: deposito, porcentaje_esquema, o costo
-- Considera los retornos aplicados para el cálculo final




CREATE TABLE IF NOT EXISTS cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nombre VARCHAR(50) NOT NULL,
  sede ENUM('GUADALAJARA', 'CANCUN') NOT NULL,
  origen VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 


delete from cliente;
alter table cliente auto_increment = 1;

INSERT INTO cliente(nombre, sede, origen) VALUES
("FERNANDO ACOSTA","GUADALAJARA","ALE TOELNTINO"),
("LIZBETH GARCIA","GUADALAJARA","ARMANDO GUERRERO"),
("CRISTIAN GOMEZ","CANCUN","CRISTIAN GOMEZ"),
("GAP","GUADALAJARA","E.KURI"),
("PINN MX","GUADALAJARA","E.KURI"),
("OCAN","GUADALAJARA","FRANCISCO GUZMAN"),
("SANTIAGO","CANCUN","FRANCISCO GUZMAN"),
("TANIA CASTILLO","GUADALAJARA","E.KURI"),
("SANDRA","GUADALAJARA","E.KURI"),
("GILDA LOPEZ PLAZA BALAGAN","GUADALAJARA","E.KURI"),
("PAULINA CAMACHO","CANCUN","E.KURI"),
("HENRY LEON","GUADALAJARA","E.KURI"),
("TELE INFORMATICA","GUADALAJARA","E.KURI"),
("OSCAR CLEMENTE","GUADALAJARA","E.KURI")

UPDATE cliente 
SET codigo = CASE 
    WHEN sede = 'GUADALAJARA' THEN CONCAT('NM1', LPAD(id, 4, '0'))
    WHEN sede = 'CANCUN' THEN CONCAT('NM2', LPAD(id, 4, '0'))
    ELSE CONCAT('NM0', LPAD(id, 4, '0'))
END;


/*
create VIEW view_clientes as
SELECT
c.id,
c.codigo,
c.nombre,
c.sede,
c.cms_general,
c.esquema,
b1.id id_broker1,
b1.nombre broker1,
b1.porcentaje porcentaje_broker1,
b2.id id_broker2,
b2.nombre broker2,
b2.porcentaje porcentaje_broker2,
b3.id id_broker3,
b3.nombre broker3,
b3.porcentaje porcentaje_broker3,
c.origen,
c.costo
FROM cliente c 
LEFT JOIN broker b1 on b1.id = c.id_broker1
LEFT JOIN broker b2 on b2.id = c.id_broker2
LEFT JOIN broker b3 on b3.id = c.id_broker3
*/
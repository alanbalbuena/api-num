-- Crear tabla usuario si no existe
CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  permisos ENUM('DIRECCION','ADMINISTRACION','TESORERIA','OPERACIONES','FACTURACION','CONTABILIDAD') NOT NULL,
  password VARCHAR(255) NOT NULL DEFAULT 'password123',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuario_correo (correo)
); 

/*
INSERT into usuario(nombre, apellido,correo,permisos,password) values
("TERESITA DE JESUS","OROZCO","torozco@num.mx","FACTURACION","password123"),
("LUZ ALEJANDRA","VARGAS","atolentino@num.mx","FACTURACION","password123"),
("FRANCISCO JAVIER","GUZMAN","fguzman@num.mx","FACTURACION","password123"),
("CHRISTIAN JAZMIN","ALCALA","jalcala@num.mx","FACTURACION","password123"),
("LORENA","AYALA","layala@num.mx","FACTURACION","password123"),
("FELIPE DE JESUS","VARGAS","fvargas@num.mx","FACTURACION","password123"),
("MARIANA GUADALUPE","PEREZ","mmuñoz@num.mx","FACTURACION","password123"),
("PEDRO ISAAC","COIN","pcoin@num.mx","FACTURACION","password123"),
("SANDRA LETICIA","SANCHEZ","ssanchez@num.mx","FACTURACION","password123"),
("PEDRO ARMANDO","GUERRERO","pguerrero@num.mx","FACTURACION","password123"),
("MARIA GUADALUPE","SANCHEZ","gsanchez@num.mx","FACTURACION","password123"),
("JOSE JAVIER","SANDOVAL","jsandoval@num.mx","FACTURACION","password123"),
("EDGAR ALAN","BALBUENA","abalbuena@num.mx","ADMINISTRACION","password123")
*/
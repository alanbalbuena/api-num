-- Crear tabla movimientos_bancarios
CREATE TABLE IF NOT EXISTS movimientos_bancarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_banco INT NOT NULL,
  egreso DECIMAL(15,2) DEFAULT 0.00,
  ingreso DECIMAL(15,2) DEFAULT 0.00,
  fecha DATE NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  referencia VARCHAR(100) NULL,
  comentarios TEXT NULL,
  id_factura INT NULL,
  id_usuario INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_banco) REFERENCES bancos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE RESTRICT,
  INDEX idx_banco (id_banco),
  INDEX idx_fecha (fecha),
  INDEX idx_usuario (id_usuario),
  INDEX idx_factura (id_factura),
  INDEX idx_egreso (egreso),
  INDEX idx_ingreso (ingreso)
);

-- Crear vista para obtener movimientos con información completa
CREATE OR REPLACE VIEW view_movimientos_completos AS
SELECT 
  mb.id,
  mb.id_banco,
  b.nombre_banco,
  b.numero_cuenta,
  b.clabe_interbancaria,
  mb.egreso,
  mb.ingreso,
  mb.fecha,
  mb.descripcion,
  mb.referencia,
  mb.comentarios,
  mb.id_factura,
  mb.id_usuario,
  u.nombre as usuario_nombre,
  e.nombre as empresa_nombre,
  e.rfc as empresa_rfc,
  mb.created_at,
  mb.updated_at
FROM movimientos_bancarios mb
LEFT JOIN bancos b ON mb.id_banco = b.id
LEFT JOIN usuario u ON mb.id_usuario = u.id
LEFT JOIN empresa e ON b.id_empresa = e.id;

-- Crear vista para obtener resumen de movimientos por banco
CREATE OR REPLACE VIEW view_resumen_movimientos_banco AS
SELECT 
  b.id as id_banco,
  b.nombre_banco,
  b.numero_cuenta,
  b.clabe_interbancaria,
  e.nombre as empresa_nombre,
  COUNT(mb.id) as total_movimientos,
  SUM(mb.ingreso) as total_ingresos,
  SUM(mb.egreso) as total_egresos,
  (b.saldo_inicial + SUM(mb.ingreso) - SUM(mb.egreso)) as saldo_actual,
  MAX(mb.fecha) as ultimo_movimiento
FROM bancos b
LEFT JOIN movimientos_bancarios mb ON b.id = mb.id_banco
LEFT JOIN empresa e ON b.id_empresa = e.id
GROUP BY b.id, b.nombre_banco, b.numero_cuenta, b.clabe_interbancaria, e.nombre, b.saldo_inicial; 

delete from movimientos_bancarios;
alter table movimientos_bancarios auto_increment = 1;

insert into movimientos_bancarios (id_banco, egreso, ingreso, fecha, descripcion, id_usuario) values
  (6, '', 2000.00, '2025-05-03', 'SPEI RECIBIDOAFIRME/0137330460 062 0000001CYC ALMIA B117 ARRENDAMIENTO', 1),
  (6, '', 7000.00, '2025-05-04', 'SPEI RECIBIDOSANTANDER/0138185021 014 9867745RENTA JUNIO 2025', 1),
  (1, '', 1500.00, '2025-05-05', 'SPEI RECIBIDOBANAMEX/0115216317  002 0170625B126', 1),
  (2, 50000.00, '', '2025-05-08', 'SPEI ENVIADO FONDEADORA/0026423253 699 0100625TRASPASO', 1),
  (3, 50000.00, '', '2025-05-14', 'SPEI ENVIADO FONDEADORA/0026423875 699 0100625TRASPASO', 1),
  (5, 35000.00, '', '2025-05-14', 'SPEI ENVIADO FONDEADORA/0026425072 699 0100625TRASPASO', 1),
  (5, 35000.00, '', '2025-05-14', 'SPEI ENVIADO FONDEADORA/0026426092 699 0100625TRASPASO', 1),
  (3, '', 2800.00, '2025-05-22', 'SPEI RECIBIDOSANTANDER/0176403805 014 8198520PAGO FAC A579', 1),
  (6, '', 3500.00, '2025-05-23', 'SPEI RECIBIDOSANTANDER/0176412643 014 8200354PAGO FAC A578', 1)



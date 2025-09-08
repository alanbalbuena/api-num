-- Crear tabla bancos
CREATE TABLE IF NOT EXISTS bancos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_banco VARCHAR(100) NOT NULL,
  numero_cuenta VARCHAR(20) NULL,
  clabe_interbancaria VARCHAR(18) NULL,
  saldo_inicial DECIMAL(15,2) DEFAULT 0.00,
  id_empresa INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE,
  INDEX idx_empresa (id_empresa),
  INDEX idx_nombre_banco (nombre_banco),
  UNIQUE KEY unique_clabe (clabe_interbancaria),
  UNIQUE KEY unique_numero_cuenta (numero_cuenta)
);

-- Crear vista para obtener bancos con información de empresa
CREATE OR REPLACE VIEW view_bancos_empresas AS
SELECT 
  b.id,
  b.nombre_banco,
  b.numero_cuenta,
  b.clabe_interbancaria,
  b.saldo_inicial,
  b.id_empresa,
  e.nombre as empresa_nombre,
  e.rfc as empresa_rfc,
  b.created_at,
  b.updated_at
FROM bancos b
LEFT JOIN empresa e ON b.id_empresa = e.id; 

INSERT INTO bancos (nombre_banco, numero_cuenta, clabe_interbancaria, saldo_inicial, id_empresa) VALUES
("BANCOMER","123123537","12320001231235300","100000",8),
("BANCOMER","120413356","12320001204133500","100000",1),
("BANCOMER","125185955","12320001251859500","100000",14),
("FONDEADORA","","646090258696563000","100000",10),
("BANCOMER","123146669","1232000123146660",	"100000",9),
("BANCOMER","120640948","12320001206409400","100000",3);
 
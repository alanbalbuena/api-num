-- Crear tabla empresa si no existe
CREATE TABLE IF NOT EXISTS empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  rfc VARCHAR(13) NOT NULL UNIQUE,
  giro VARCHAR(100),
  destino VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 


/*
INSERT INTO empresa(nombre, rfc,giro,destino) VALUES
("ALMIA", "ABP221107IRA", "Servicios inmobiliarios y comision mercantil","GUADALAJARA"),
("GREENLIFE", "OSG2104222K1", "Servicios contables y fiscales","GUADALAJARA"),
("FRAMEN", "FCF220317642", "Empresa de descarga | factura a empresas internas","GUADALAJARA"),
("IURISLAWMANY", "IUR221116QG0", "Servicios Legales","GUADALAJARA"),
("HOLDING", "LHO2212067S5", "Estrategia SAPI | No emite facturacion","GUADALAJARA"),
("THALFURD", "MCT2103097D5", "Servicios de publicidad, Consultoria en computación, Comisión mercantil y Servicios de producción y presentacion de espectaculos","GUADALAJARA"),
("MARSAMATRUH", "MAR2211242E1", "Servicios administrativos","GUADALAJARA"),
("BELEHREN", "CVB230712586", "Empresa de descarga | factura a empresas internas","GUADALAJARA"),
("FERRETERÍA", "FCI230228L79", "Comercio de maquinaria y equipo para construcción, Ferreteria y Tlapaleria","GUADALAJARA"),
("CREIGTHON", "CCO231101K58", "Constructora y Servicios de reparación de maquinaria","GUADALAJARA"),
("MERENVUORI", "MER230313FH7", "Constructora","GUADALAJARA"),
("PIHTIRANTA", "PIH2304257D5", "Estrategia SAPI | No emite facturacion","GUADALAJARA"),
("DISEÑOS MCFLY", "DMC240412836", "Servicios de publicidad","GUADALAJARA"),
("GPO AGROBRATIN", "GAG240422GX4", "Sector primario (Agricultura), Servicios de fumigación","GUADALAJARA"),
("NEW AGE", "NAT2302242U5", "Mantenimiento a aires acondicionados","GUADALAJARA"),
("BENINIFERSEN", "BEN230918EI2", "Constructora","GUADALAJARA"),
("CONCRETIMAXBIL", "CON230612M78", "Constructora","CANCUN"),
("HARMENOM", "HAV230330BB9", "Agencia de viajes","CANCUN"),
("PLANBENLLA", "PLA221125B68", "Agencia de publicidad","CANCUN"),
("CONSORCIO", "CHI230519RI7", "Agencia de colocación y servicios administrativos","CANCUN")
*/
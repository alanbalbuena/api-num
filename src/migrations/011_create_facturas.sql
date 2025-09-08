CREATE TABLE facturas (
    id SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    receptor VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    folio VARCHAR(50) NOT NULL,
    uuid VARCHAR(36) UNIQUE,
    tipo_comprobante VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    fecha_emision DATE NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    forma_pago VARCHAR(50) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    iva DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Llave foránea explícita
    CONSTRAINT fk_facturas_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_facturas_id_empresa ON facturas(id_empresa);
CREATE INDEX idx_facturas_uuid ON facturas(uuid);
CREATE INDEX idx_facturas_folio ON facturas(folio);
CREATE INDEX idx_facturas_fecha_emision ON facturas(fecha_emision);
CREATE INDEX idx_facturas_estado ON facturas(estado);


INSERT INTO `facturas` (`id_empresa`, `receptor`, `rfc`, `folio`, `uuid`, `tipo_comprobante`, `estado`, `fecha_emision`, `metodo_pago`, `forma_pago`, `subtotal`, `total`, `iva`) VALUES
('6',	'CAISA INDUSTRIAS'	             ,'CIN190725JZ7'  ,'B115',	'0840B8E3-1B48-42F9-AFE7-A1CD49D1BC90',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/02',	'PUE|Pago en una sola exhibición',	        '02|Cheque nominativo',	                     '32000.00',	 '37120.00',	 '5120.00'),
('1',	'TRANSPORTADORA ZEMOG'           ,'TZE041202NV4'  ,'B116',	'D5562D91-82F0-47F0-845F-752A60B7DD98',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/02',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	'109821.24',	'127392.64',	'17571.40'),
('1',	'COBRA Y CASCABEL'	             ,'CCA240613KB3'  ,'B117',	'79CCCDB2-4441-47E7-9399-60C5A69522BA',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/02',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	 '26000.00',	 '30160.00',	 '4160.00'),
('2',	'FB DISTRIBUCIONES'	             ,'FDI1502063M0'  ,'B118',	'019C5E0E-D307-46FA-88C8-BA912FB711CE',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/02',	'PPD|Pago en parcialidades o diferido',	    '99|Por definir',	                         '25000.00',	 '29000.00',	 '4000.00'),
('2',	'JM OPERADORA DE FRANQUICIAS'	 ,'JOF930921UZ2'  ,'B119',	'04A0BA97-6D45-490E-A36A-FE2EC8CFF8C2',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/02',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	 '10000.00',	 '11600.00',	 '1600.00'),
('3',	'JM OPERADORA DE FRANQUICIAS'	 ,'JOF930921UZ2'  ,'B120',	'91AA038C-29AD-47EC-A5CA-33CEBE7E760E',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/02',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	 '32000.00',	 '37120.00',	 '5120.00'),
('1',	'CAISA INDUSTRIAS'	             ,'CIN190725JZ7'  ,'B121',	'5166BBD2-1D88-4B6B-91B9-D41A23388AAE',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/11',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	 '38000.00',	 '44080.00',	 '6080.00'),
('1',	'GORILA PLASTICOS'	             ,'GPL040302F39'  ,'B122',	'5014C41F-A879-4E67-ACCD-5D435F032812',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/12',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	 '39000.00',	 '45240.00',	 '6240.00'),
('5',	'JOSE REFUGIO CASTRO BAÑUELOS'	 ,'CABR7511196N4' ,'B123',	'6006C5E5-DBAB-4D49-B278-E338A38CD5CC',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/12',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	 '22000.00',	 '25520.00',	 '3520.00'),
('5',	'JOSE REFUGIO CASTRO BAÑUELOS'	 ,'CABR7511196N4' ,'B124',	'9EA7846D-C7B3-4E0E-B4B8-8C5DD4DD8BCE',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/12',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	  '5000.00',	  '5800.00',	   '800.00'),
('5',	'HILDA ESTEPHANY BERTRAND CORTE' ,'BECH900220EXA' ,'B125',	'FF674A90-9E3D-4ECC-802E-F411C0FF0A6F',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/12',	'PUE|Pago en una sola exhibición',	        '03|Transferencia electrónica de fondos',	 '20000.00',	 '23200.00',	  '3200.00'),
('5',	'GUARDIAS BARI'	                 ,'GBA110124UU2'  ,'B126',	'2492AA0F-7553-4A4A-8FF2-E3B8651D6825',	'ARRENDAMIENTO',	'PENDIENTE',	'2025/06/10',	'PPD|Pago en parcialidades o diferido',	    '99|Por definir',	                         '13800.00',	 '16008.00',	  '2208.00')

-- // src/config/inserts.sql

-- Insertar los status y sus descripciones
INSERT INTO pancomido.order_status (status, description) VALUES
('En revisión', 'Orden creada en sistema. En proceso de confirmación'),
('Confirmada', 'Orden confirmada. En lista de preparación'),
('En preparación', 'Orden en preparación. En proceso de empaque y listado distribución'),
('En despacho', 'Orden lista para despacho. En proceso de distribución'),
('Suspendida', 'Orden suspendida. A confirmar con cliente. Espere contacto'),
('Sin contacto', 'Entrega suspendida. Sin contacto con cliente. Favor contactar.'),
('Finalizada', 'Orden entregada y finalizada');

-- Insertar los tipos de usuarios
INSERT INTO pancomido.roles (role) VALUES ('customer'), ('admin'), ('developer');

--------------------------------------------------------------------------------
-- INSERTS PARA REGIONS, PROVINCES Y CITIES (COMUNAS)
--------------------------------------------------------------------------------
-- 1. Regiones (con concatenación "Identificador - Región")
INSERT INTO pancomido.regions (region) VALUES ('XV - Arica y Parinacota');
INSERT INTO pancomido.regions (region) VALUES ('I - Tarapaca');
INSERT INTO pancomido.regions (region) VALUES ('II - Antofagasta');
INSERT INTO pancomido.regions (region) VALUES ('III - Atacama');
INSERT INTO pancomido.regions (region) VALUES ('IV - Coquimbo');
INSERT INTO pancomido.regions (region) VALUES ('V - Valparaiso');
INSERT INTO pancomido.regions (region) VALUES ('RM - Metropolitana de Santiago');
INSERT INTO pancomido.regions (region) VALUES ('VI - Libertador General Bernardo O''Higgins');
INSERT INTO pancomido.regions (region) VALUES ('VII - Maule');
INSERT INTO pancomido.regions (region) VALUES ('XVI - Ñuble');
INSERT INTO pancomido.regions (region) VALUES ('VIII - Biobio');
INSERT INTO pancomido.regions (region) VALUES ('IX - Araucania');
INSERT INTO pancomido.regions (region) VALUES ('XIV - Los Rios');
INSERT INTO pancomido.regions (region) VALUES ('X - Los Lagos');
INSERT INTO pancomido.regions (region) VALUES ('XI - Aysen del General Carlos Ibañez del Campo');
INSERT INTO pancomido.regions (region) VALUES ('XII - Magallanes y de la Antartica Chilena');

--------------------------------------------------------------------------------
-- 2. Provinces (cada una se vincula a su región mediante subconsulta)
--------------------------------------------------------------------------------
-- Región XV - Arica y Parinacota
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XV - Arica y Parinacota'), 'Arica');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XV - Arica y Parinacota'), 'Parinacota');

-- Región I - Tarapaca
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca'), 'Iquique');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca'), 'Tamarugal');

-- Región II - Antofagasta
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta'), 'Antofagasta');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta'), 'El Loa');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta'), 'Tocopilla');

-- Región III - Atacama
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'III - Atacama'), 'Chañaral');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'III - Atacama'), 'Copiapo');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'III - Atacama'), 'Huasco');

-- Región IV - Coquimbo
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo'), 'Choapa');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo'), 'Elqui');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo'), 'Limari');

-- Región V - Valparaiso
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'Isla de Pascua');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'Los Andes');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'Marga Marga');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'Petorca');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'Quillota');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'San Antonio');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'San Felipe de Aconcagua');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso'), 'Valparaiso');

-- Región VI - Libertador General Bernardo O'Higgins
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins'), 'Cachapoal');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins'), 'Cardenal Caro');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins'), 'Colchagua');

-- Región VII - Maule
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VII - Maule'), 'Cauquenes');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VII - Maule'), 'Curico');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VII - Maule'), 'Linares');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VII - Maule'), 'Talca');

-- Región XVI - Ñuble
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble'), 'Diguillin');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble'), 'Itata');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble'), 'Punilla');

-- Región VIII - Biobio
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio'), 'Arauco');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio'), 'Biobio');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio'), 'Concepcion');

-- Región IX - Araucania
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania'), 'Cautin');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania'), 'Malleco');

-- Región XIV - Los Rios
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios'), 'Ranco');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios'), 'Valdivia');

-- Región X - Los Lagos
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos'), 'Chiloe');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos'), 'Llanquihue');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos'), 'Osorno');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos'), 'Palena');

-- Región XI - Aysen del General Carlos Ibañez del Campo
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo'), 'Aysen');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo'), 'Capitan Prat');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo'), 'Coyhaique');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo'), 'General Carrera');

-- Región XII - Magallanes y de la Antartica Chilena
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena'), 'Antartica Chilena');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena'), 'Magallanes');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena'), 'Tierra del Fuego');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena'), 'ultima Esperanza');

-- Región RM - Metropolitana de Santiago
INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago'), 'Chacabuco');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago'), 'Cordillera');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago'), 'Maipo');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago'), 'Melipilla');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago'), 'Santiago');

INSERT INTO pancomido.provinces (id_region, province)
VALUES ((SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago'), 'Talagante');

--------------------------------------------------------------------------------
-- 3. Cities (Comunas)
-- Se insertan utilizando el id_province obtenido a través de una subconsulta que también verifica la región.

-- Región XV - Arica y Parinacota
-- Provincia: Arica
INSERT INTO pancomido.cities (id_province, city)
VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arica' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XV - Arica y Parinacota')),
  'Arica'
);
INSERT INTO pancomido.cities (id_province, city)
VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arica' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XV - Arica y Parinacota')),
  'Camarones'
);
-- Provincia: Parinacota
INSERT INTO pancomido.cities (id_province, city)
VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Parinacota' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XV - Arica y Parinacota')),
  'General Lagos'
);
INSERT INTO pancomido.cities (id_province, city)
VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Parinacota' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XV - Arica y Parinacota')),
  'Putre'
);

-- Región I - Tarapaca
-- Provincia: IquiqueC6
INSERT INTO pancomido.cities (id_province, city)
VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Iquique' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca')),
  'Alto Hospicio'
);
-- Provincia: Iquique
INSERT INTO pancomido.cities (id_province, city)
VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Iquique' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca')),
  'Iquique'
);
-- Provincia: Tamarugal
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tamarugal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca')),
  'Camiña'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tamarugal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca')),
  'Colchane'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tamarugal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca')),
  'Huara'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tamarugal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca')),
  'Pica'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tamarugal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'I - Tarapaca')),
  'Pozo Almonte'
);

-- Región II - Antofagasta
-- Provincia: Antofagasta
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Antofagasta' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Antofagasta'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Antofagasta' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Mejillones'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Antofagasta' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Sierra Gorda'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Antofagasta' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Taltal'
);
-- Provincia: El Loa
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'El Loa' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Calama'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'El Loa' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Ollague'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'El Loa' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'San Pedro de Atacama'
);
-- Provincia: Tocopilla
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tocopilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Maria Elena'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tocopilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'II - Antofagasta')),
  'Tocopilla'
);

-- Región III - Atacama
-- Provincia: Chañaral
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chañaral' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Chañaral'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chañaral' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Diego de Almagro'
);
-- Provincia: Copiapo
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Copiapo' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Caldera'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Copiapo' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Copiapo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Copiapo' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Tierra Amarilla'
);
-- Provincia: Huasco
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Huasco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Alto del Carmen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Huasco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Freirina'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Huasco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Huasco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Huasco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'III - Atacama')),
  'Vallenar'
);

-- Región IV - Coquimbo
-- Provincia: Choapa
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Choapa' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Canela'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Choapa' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Illapel'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Choapa' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Los Vilos'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Choapa' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Salamanca'
);
-- Provincia: Elqui
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Elqui' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Andacollo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Elqui' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Coquimbo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Elqui' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'La Higuera'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Elqui' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'La Serena'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Elqui' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Paihuano'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Elqui' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Vicuña'
);
-- Provincia: Limari
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Limari' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Combarbala'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Limari' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Monte Patria'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Limari' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Ovalle'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Limari' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Punitaqui'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Limari' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IV - Coquimbo')),
  'Rio Hurtado'
);

-- Región V - Valparaiso
-- Provincia: Isla de Pascua
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Isla de Pascua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Isla de Pascua'
);
-- Provincia: Los Andes
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Los Andes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Calle Larga'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Los Andes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Los Andes'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Los Andes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Rinconada de Los Andes'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Los Andes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'San Esteban'
);
-- Provincia: Marga Marga
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Marga Marga' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Limache'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Marga Marga' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Olmue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Marga Marga' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Quilpue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Marga Marga' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Villa Alemana'
);
-- Provincia: Petorca
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Petorca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Cabildo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Petorca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'La Ligua'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Petorca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Papudo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Petorca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Petorca'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Petorca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Zapallar'
);
-- Provincia: Quillota
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Quillota' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Hijuelas'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Quillota' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'La Calera'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Quillota' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'La Cruz'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Quillota' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Nogales'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Quillota' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Quillota'
);
-- Provincia: San Antonio
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Antonio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Algarrobo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Antonio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Cartagena'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Antonio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'El Quisco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Antonio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'El Tabo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Antonio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'San Antonio'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Antonio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Santo Domingo'
);
-- Provincia: San Felipe de Aconcagua
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Felipe de Aconcagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Catemu'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Felipe de Aconcagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Llaillay'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Felipe de Aconcagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Panquehue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Felipe de Aconcagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Putaendo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Felipe de Aconcagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'San Felipe'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'San Felipe de Aconcagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Santa Maria'
);
-- Provincia: Valparaiso
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valparaiso' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Casablanca'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valparaiso' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Concon'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valparaiso' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Juan Fernandez'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valparaiso' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Puchuncavi'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valparaiso' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Quintero'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valparaiso' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Valparaiso'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valparaiso' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'V - Valparaiso')),
  'Viña del Mar'
);

-- Región VI - Libertador General Bernardo O'Higgins
-- Provincia: Cachapoal
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Codegua'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Coinco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Coltauco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Doñihue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Graneros'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Las Cabras'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Machali'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Malloa'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Olivar'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Peumo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Pichidegua'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Quinta de Tilcoco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Rancagua'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Requinoa'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Rengo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'San Francisco de Mostazal'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cachapoal' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'San Vicente de Tagua Tagua'
);
-- Provincia: Cardenal Caro
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cardenal Caro' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'La Estrella'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cardenal Caro' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Litueche'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cardenal Caro' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Marchigue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cardenal Caro' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Navidad'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cardenal Caro' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Paredones'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cardenal Caro' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Pichilemu'
);
-- Provincia: Colchagua
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Chepica'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Chimbarongo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Lolol'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Nancagua'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Palmilla'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Peralillo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Placilla'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Pumanque'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'San Fernando'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Colchagua' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VI - Libertador General Bernardo O''Higgins')),
  'Santa Cruz'
);

-- Región VII - Maule
-- Provincia: Cauquenes
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cauquenes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Cauquenes'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cauquenes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Chanco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cauquenes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Pelluhue'
);
-- Provincia: Curico
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Curico'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Hualañe'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Licanten'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Molina'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Rauco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Romeral'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Sagrada Familia'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Teno'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Curico' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Vichuquen'
);
-- Provincia: Linares
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Colbun'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Linares'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Longavi'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Parral'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Retiro'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'San Javier de Loncomilla'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Villa Alegre'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Linares' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Yerbas Buenas'
);
-- Provincia: Talca
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Constitucion'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Curepto'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Empedrado'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Maule'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Pelarco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Pencahue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Rio Claro'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'San Clemente'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'San Rafael'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talca' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VII - Maule')),
  'Talca'
);

-- Región XVI - Ñuble
-- Provincia: Diguillin
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Bulnes'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Chillan'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Chillan Viejo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'El Carmen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Pemuco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Pinto'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Quillon'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'San Ignacio'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Diguillin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Yungay'
);
-- Provincia: Itata
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Itata' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Cobquecura'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Itata' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Coelemu'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Itata' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Ninhue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Itata' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Portezuelo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Itata' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Quirihue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Itata' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Ranquil'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Itata' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Treguaco'
);
-- Provincia: Punilla
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Punilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Coihueco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Punilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'Ñiquen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Punilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'San Carlos'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Punilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'San Fabian'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Punilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XVI - Ñuble')),
  'San Nicolas'
);

-- Región VIII - Biobio
-- Provincia: Arauco
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arauco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Arauco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arauco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Cañete'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arauco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Contulmo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arauco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Curanilahue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arauco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Lebu'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arauco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Los alamos'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Arauco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Tirua'
);
-- Provincia: Biobio
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Alto Biobio'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Antuco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Cabrero'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Laja'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Los angeles'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Mulchen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Nacimiento'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Negrete'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Quilaco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Quilleco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'San Rosendo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Santa Barbara'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Tucapel'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Biobio' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Yumbel'
);
-- Provincia: Concepcion
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Chiguayante'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Concepcion'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Coronel'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Florida'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Hualpen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Hualqui'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Lota'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Penco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'San Pedro de la Paz'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Santa Juana'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Talcahuano'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Concepcion' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'VIII - Biobio')),
  'Tome'
);

-- Región IX - Araucania
-- Provincia: Cautin
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Carahue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Cholchol'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Cunco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Curarrehue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Freire'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Galvarino'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Gorbea'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Lautaro'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Loncoche'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Melipeuco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Nueva Imperial'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Padre Las Casas'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Perquenco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Pitrufquen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Pucon'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Saavedra'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Temuco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Teodoro Schmidt'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Tolten'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Vilcun'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cautin' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Villarrica'
);
-- Provincia: Malleco
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Angol'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Collipulli'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Curacautin'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Ercilla'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Lonquimay'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Los Sauces'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Lumaco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Puren'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Renaico'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Traiguen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Malleco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'IX - Araucania')),
  'Victoria'
);

-- Región XIV - Los Rios
-- Provincia: Ranco
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Ranco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Futrono'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Ranco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'La Union'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Ranco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Lago Ranco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Ranco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Rio Bueno'
);
-- Provincia: Valdivia
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Corral'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Lanco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Los Lagos'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Mafil'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Mariquina'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Paillaco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Panguipulli'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Valdivia' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XIV - Los Rios')),
  'Valdivia'
);

-- Región X - Los Lagos
-- Provincia: Chiloe
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Ancud'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Castro'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Chonchi'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Curaco de Velez'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Dalcahue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Puqueldon'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Queilen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chiloe' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Quellon'
);
-- Provincia: Llanquihue
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Calbuco'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Cochamo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Fresia'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Frutillar'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Llanquihue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Los Muermos'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Maullin'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Puerto Montt'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Llanquihue' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Puerto Varas'
);
-- Provincia: Osorno
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Osorno' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Osorno'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Osorno' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Puerto Octay'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Osorno' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Purranque'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Osorno' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Puyehue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Osorno' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Rio Negro'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Osorno' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'San Pablo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Osorno' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'San Juan de la Costa'
);
-- Provincia: Palena
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Palena' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Chaiten'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Palena' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Futaleufu'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Palena' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Hualaihue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Palena' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'X - Los Lagos')),
  'Palena'
);

-- Región XI - Aysen del General Carlos Ibañez del Campo
-- Provincia: Aysen
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Aysen' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Aysen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Aysen' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Cisnes'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Aysen' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Guaitecas'
);
-- Provincia: Capitan Prat
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Capitan Prat' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Cochrane'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Capitan Prat' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'O''Higgins'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Capitan Prat' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Tortel'
);
-- Provincia: Coyhaique
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Coyhaique' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Coyhaique'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Coyhaique' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Lago Verde'
);
-- Provincia: General Carrera
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'General Carrera' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Chile Chico'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'General Carrera' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XI - Aysen del General Carlos Ibañez del Campo')),
  'Rio Ibañez'
);

-- Región XII - Magallanes y de la Antartica Chilena
-- Provincia: Antartica Chilena
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Antartica Chilena' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Antartica'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Antartica Chilena' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Cabo de Hornos'
);
-- Provincia: Magallanes
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Magallanes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Laguna Blanca'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Magallanes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Punta Arenas'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Magallanes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Rio Verde'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Magallanes' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'San Gregorio'
);
-- Provincia: Tierra del Fuego
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tierra del Fuego' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Porvenir'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tierra del Fuego' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Primavera'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Tierra del Fuego' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Timaukel'
);
-- Provincia: ultima Esperanza
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'ultima Esperanza' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Natales'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'ultima Esperanza' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'XII - Magallanes y de la Antartica Chilena')),
  'Torres del Paine'
);

-- Región RM - Metropolitana de Santiago
-- Provincia: Chacabuco
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chacabuco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Colina'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chacabuco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Lampa'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Chacabuco' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Tiltil'
);
-- Provincia: Cordillera
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cordillera' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Pirque'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cordillera' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Puente Alto'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Cordillera' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'San Jose de Maipo'
);
-- Provincia: Maipo
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Maipo' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Buin'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Maipo' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Calera de Tango'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Maipo' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Paine'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Maipo' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'San Bernardo'
);
-- Provincia: Melipilla
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Melipilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Alhue'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Melipilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Curacavi'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Melipilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Maria Pinto'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Melipilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Melipilla'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Melipilla' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'San Pedro'
);
-- Provincia: Santiago
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Cerrillos'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Cerro Navia'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Conchali'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'El Bosque'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Estacion Central'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Huechuraba'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Independencia'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'La Cisterna'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'La Granja'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'La Florida'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'La Pintana'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'La Reina'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Las Condes'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Lo Barnechea'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Lo Espejo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Lo Prado'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Macul'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Maipu'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Ñuñoa'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Pedro Aguirre Cerda'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Peñalolen'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Providencia'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Pudahuel'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Quilicura'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Quinta Normal'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Recoleta'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Renca'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'San Miguel'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'San Joaquin'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'San Ramon'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Santiago'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Santiago' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Vitacura'
);
-- Provincia: Talagante
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talagante' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'El Monte'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talagante' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Isla de Maipo'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talagante' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Padre Hurtado'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talagante' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Peñaflor'
);
INSERT INTO pancomido.cities (id_province, city) VALUES (
  (SELECT id FROM pancomido.provinces 
     WHERE province = 'Talagante' 
       AND id_region = (SELECT id FROM pancomido.regions WHERE region = 'RM - Metropolitana de Santiago')),
  'Talagante'
);
-- // src/config/init.sql

--------------------------------------------------------------------------------
-- CREACIÓN DE BD y SCHEMA
--------------------------------------------------------------------------------

-- Crear el esquema pancomido (opcional)
CREATE SCHEMA IF NOT EXISTS pancomido;

-- Ajustar search_path para que las consultas se hagan por defecto en este esquema
SET search_path TO pancomido;

--------------------------------------------------------------------------------
-- CREACIÓN DE TABLAS CON REGIÓN -> PROVINCE -> CIUDAD, ÍNDICES, TIMESTAMPS Y RESTRICCIONES
--------------------------------------------------------------------------------

-- Tabla regiones
CREATE TABLE pancomido.regions (
    id          SERIAL          PRIMARY KEY,
    region      VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);


-- Tabla provinces (Provincias)
-- Cada provincia pertenece a una región.
CREATE TABLE pancomido.provinces (
    id          SERIAL          PRIMARY KEY,
    id_region   INT             NOT NULL,
    province    VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_provinces_regions FOREIGN KEY (id_region) 
        REFERENCES pancomido.regions(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Índice en provinces para id_region
CREATE INDEX idx_provinces_id_region ON pancomido.provinces (id_region);

-- Tabla ciudades
-- Cada ciudad pertenece a una provincia.
CREATE TABLE pancomido.cities (
    id          SERIAL          PRIMARY KEY,
    id_province INT             NOT NULL,
    city        VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_cities_provinces FOREIGN KEY (id_province) 
        REFERENCES pancomido.provinces(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Índice en cities para id_province
CREATE INDEX idx_cities_id_province ON pancomido.cities (id_province);

-- Tabla roles
CREATE TABLE pancomido.roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla usuarios
CREATE TABLE pancomido.users (
    id          SERIAL          PRIMARY KEY,
    rut         VARCHAR(20)     UNIQUE,
    name        VARCHAR(50)     NOT NULL,
    lastname    VARCHAR(50)     NOT NULL,
    phone       VARCHAR(20),
    mail        VARCHAR(100)    NOT NULL UNIQUE,
    password    VARCHAR(200)    NOT NULL,
    role_id     INT             NOT NULL DEFAULT 1,
    disabled    BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_users_roles FOREIGN KEY (role_id) 
        REFERENCES pancomido.roles(id)
);

-- Índice en users para role_id (si es necesario filtrar por rol)
CREATE INDEX idx_users_role_id ON pancomido.users (role_id);

-- Tabla de solicitudes de reseteo de contraseña

CREATE TABLE pancomido.password_reset_requests (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    reset_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);




-- Tabla direcciones
CREATE TABLE pancomido.address (
    id          SERIAL          PRIMARY KEY,
    id_user     INT             NOT NULL,
    id_city     INT             NOT NULL,
    address     VARCHAR(200)    NOT NULL,
    postal_code VARCHAR(10),
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    main        BOOLEAN         NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_address_users FOREIGN KEY (id_user) 
        REFERENCES pancomido.users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_address_cities FOREIGN KEY (id_city) 
        REFERENCES pancomido.cities(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- Índices en address para id_user e id_city
CREATE INDEX idx_address_id_user ON pancomido.address (id_user);
CREATE INDEX idx_address_id_city ON pancomido.address (id_city);

-- Tabla productos
CREATE TABLE pancomido.products (
    id           SERIAL          PRIMARY KEY,
    product      VARCHAR(100)    NOT NULL,
    ingredients  TEXT,
    price        INTEGER         NOT NULL CHECK (price >= 0),
    weight       NUMERIC(10,2)   CHECK (weight >= 0),
    description  TEXT,
    nutrition    TEXT,
    available    BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP       NOT NULL DEFAULT NOW()
);



-- Tabla pedidos
CREATE TABLE pancomido.orders (
    id                  SERIAL          PRIMARY KEY,
    id_user             INT             NOT NULL,
    id_address          INT             NOT NULL,
    order_delivery_date DATE            NOT NULL,
    order_status_id     INT             NOT NULL,
    order_address       VARCHAR(200)    NOT NULL,
    order_city          VARCHAR(100)    NOT NULL,
    order_region        VARCHAR(100)    NOT NULL,
    order_postal_code   VARCHAR(10),
    order_phone         VARCHAR(20)     NOT NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_orders_users FOREIGN KEY (id_user) 
        REFERENCES pancomido.users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_orders_address FOREIGN KEY (id_address) 
        REFERENCES pancomido.address(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_orders_status FOREIGN KEY (order_status_id) 
        REFERENCES pancomido.order_status(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Índices en orders para id_user e id_address
CREATE INDEX idx_orders_id_user ON pancomido.orders (id_user);
CREATE INDEX idx_orders_id_address ON pancomido.orders (id_address);

-- Tabla pedido_detalle
CREATE TABLE pancomido.order_detail (
    id_order             INT             NOT NULL,
    id_product           INT             NOT NULL,
    units                INT             NOT NULL CHECK (units > 0),
    unit_price_product   NUMERIC(10,2)   NOT NULL CHECK (unit_price_product >= 0),
    CONSTRAINT pk_order_detail PRIMARY KEY (id_order, id_product),
    CONSTRAINT fk_detail_order FOREIGN KEY (id_order) 
        REFERENCES pancomido.orders(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_detail_product FOREIGN KEY (id_product) 
        REFERENCES pancomido.products(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Índice en order_detail para id_product
CREATE INDEX idx_order_detail_id_product ON pancomido.order_detail (id_product);

-- Índice en orders para order_status_id
CREATE INDEX idx_orders_order_status_id ON pancomido.orders (order_status_id);

-- Tabla categorías
CREATE TABLE pancomido.categories (
    id          SERIAL          PRIMARY KEY,
    category    VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Tabla categoría_producto
CREATE TABLE pancomido.categories_products (
    id_product   INT NOT NULL,
    id_category  INT NOT NULL,
    CONSTRAINT pk_category_product PRIMARY KEY (id_product, id_category),
    CONSTRAINT fk_catprod_product FOREIGN KEY (id_product)  
        REFERENCES pancomido.products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_catprod_category FOREIGN KEY (id_category) 
        REFERENCES pancomido.categories(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Índices en categories_products para id_product e id_category
CREATE INDEX idx_catprod_id_product ON pancomido.categories_products (id_product);
CREATE INDEX idx_catprod_id_category ON pancomido.categories_products (id_category);

-- Tabla imágenes de producto
CREATE TABLE pancomido.product_img (
    id          SERIAL          PRIMARY KEY,
    id_product  INT             NOT NULL,
    url_img     VARCHAR(300)    NOT NULL,
    cloudinary_public_id VARCHAR(255) NOT null,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_imgprod_product FOREIGN KEY (id_product) 
        REFERENCES pancomido.products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Índice en product_img para id_product
CREATE INDEX idx_product_img_id_product ON pancomido.product_img (id_product);

-- Tabla stock
CREATE TABLE pancomido.stock (
    id          SERIAL          PRIMARY KEY,
    id_product  INT             NOT NULL,
    stock       INT             NOT NULL CHECK (stock >= 0),
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_stock_product FOREIGN KEY (id_product) 
        REFERENCES pancomido.products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Índice en stock para id_product
CREATE INDEX idx_stock_id_product ON pancomido.stock (id_product);

-- Índice en products para available (opcional, según uso en consultas)
CREATE INDEX idx_products_available ON pancomido.products (available);

--------------------------------------------------------------------------------
-- Tabla de estados de pedido (order_status)
--------------------------------------------------------------------------------
CREATE TABLE pancomido.order_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
);


--------------------------------------------------------------------------------
-- Tabla de lista de productos favoritos de usuario (favorites)
--------------------------------------------------------------------------------
CREATE TABLE pancomido.favorites (
    id_user     INT             NOT NULL,
    id_product  INT             NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_favorites PRIMARY KEY (id_user, id_product),
    CONSTRAINT fk_favorites_user FOREIGN KEY (id_user)
        REFERENCES pancomido.users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_favorites_product FOREIGN KEY (id_product)
        REFERENCES pancomido.products(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Índice en favorites para id_product
CREATE INDEX idx_favorites_id_product ON pancomido.favorites (id_product);



-- Crear la función de trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Crear triggers para cada tabla

-- Para la tabla regions
CREATE TRIGGER trg_update_regions_updated_at
BEFORE UPDATE ON pancomido.regions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla provinces
CREATE TRIGGER trg_update_provinces_updated_at
BEFORE UPDATE ON pancomido.provinces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla cities
CREATE TRIGGER trg_update_cities_updated_at
BEFORE UPDATE ON pancomido.cities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla users
CREATE TRIGGER trg_update_users_updated_at
BEFORE UPDATE ON pancomido.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla address
CREATE TRIGGER trg_update_address_updated_at
BEFORE UPDATE ON pancomido.address
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla products
CREATE TRIGGER trg_update_products_updated_at
BEFORE UPDATE ON pancomido.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla orders
CREATE TRIGGER trg_update_orders_updated_at
BEFORE UPDATE ON pancomido.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla categories
CREATE TRIGGER trg_update_categories_updated_at
BEFORE UPDATE ON pancomido.categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla product_img
CREATE TRIGGER trg_update_product_img_updated_at
BEFORE UPDATE ON pancomido.product_img
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Para la tabla stock
CREATE TRIGGER trg_update_stock_updated_at
BEFORE UPDATE ON pancomido.stock
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


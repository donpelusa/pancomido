// api/src/controllers/adminProducts.controller.js

const db = require('../config/db');
const Product = require('../models/Product');
const schema = process.env.DB_SCHEMA;

/**
 * Crear un nuevo producto. Se espera un body con:
 * {
 *  "product": "Nombre del producto",
 * "price": 99.99,
 * "ingredients": "Lista de ingredientes",
 * "weight": "Peso del producto",
 * "nutrition": "Información nutricional",
 * "available": true,
 * "stock": 100
 * }
 * Si no se especifica "stock", se asume 0.
 * Se devuelve el producto creado con su stock inicial.
 */

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
    try {
        const { stock, ...productData } = req.body; // Separar el stock del resto de los datos
        const newProduct = await Product.createProduct(productData);    // Insertar el producto en la tabla products

        // Insertar el stock inicial utilizando el ID del producto recién creado
        // Si no se especifica stock, se asume 0
        const initialStock = stock !== undefined ? stock : 0;
        const stockRecord = await Product.createStock(newProduct.id, initialStock);

        // Agregar el stock al objeto de respuesta
        newProduct.stock = stockRecord.stock;

        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

/**
 * Listar productos para admin: Se incluye la primera imagen (si existe)
 * y se muestran todos los campos relevantes.
 */
const getAdminProducts = async (req, res, next) => {
    try {
        const query = `SELECT p.*, pi.url_img,
            (SELECT stock FROM ${schema}.stock WHERE id_product = p.id) AS stock
                FROM ${schema}.products p
                LEFT JOIN (
                    SELECT DISTINCT ON (id_product) id_product, url_img
                    FROM ${schema}.product_img
                    ORDER BY id_product, id
                    ) pi ON p.id = pi.id_product
                    ORDER BY p.id`;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

/**
 * Actualizar datos del producto, incluyendo:
 * - Nombre, precio, ingredientes, peso, nutrición y disponibilidad.
 * - Actualización de categorías: se espera que el body incluya un arreglo "categories"
 *   con los nombres de las categorías. Se eliminarán las categorías previas y se insertarán las nuevas.
 */
const updateProductDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { product, price, ingredients, weight, nutrition, available, categories } = req.body;

        // Actualizar los datos básicos en la tabla products
        const updateQuery = `UPDATE ${schema}.products
            SET product = $1,
            price = $2,
            ingredients = $3,
            weight = $4,
            nutrition = $5,
            available = $6,
            updated_at = NOW()
            WHERE id = $7
            RETURNING *`;
        const updateValues = [product, price, ingredients, weight, nutrition, available, id];
        const { rows } = await db.query(updateQuery, updateValues);
        const updatedProduct = rows[0];

        // Actualizar categorías:
        // Primero se eliminan las entradas antiguas en categories_products para este producto.
        const deleteQuery = `
            DELETE FROM ${schema}.categories_products
            WHERE id_product = $1`;
        await db.query(deleteQuery, [id]);

        // Luego, si se proporcionó el arreglo "categories", se insertan las nuevas.
        if (Array.isArray(categories)) {
            for (const catName of categories) {
                // Verificar si la categoría ya existe.
                const catSelectQuery = `SELECT id FROM ${schema}.categories WHERE category = $1`;
                const catSelectResult = await db.query(catSelectQuery, [catName]);
                let catId;
                if (catSelectResult.rows.length > 0) {
                    catId = catSelectResult.rows[0].id;
                } else {
                    // Insertar la nueva categoría
                    const catInsertQuery = `INSERT INTO ${schema}.categories (category)
                        VALUES ($1) RETURNING id`;
                    const catInsertResult = await db.query(catInsertQuery, [catName]);
                    catId = catInsertResult.rows[0].id;
                }
                // Insertar la relación en categories_products
                const cpInsertQuery = `INSERT INTO ${schema}.categories_products (id_product, id_category)
                    VALUES ($1, $2)`;
                await db.query(cpInsertQuery, [id, catId]);
            }
        }

        res.json(updatedProduct);
    } catch (err) {
        next(err);
    }
};


/**
 * Actualizar stock de un producto.
 */
const updateStock = async (req, res, next) => {
    try {
        const { id } = req.params; // ID del producto
        const { stock } = req.body;
        const query = `
            UPDATE ${schema}.stock
            SET stock = $1,
            updated_at = NOW()
            WHERE id_product = $2
            RETURNING *`;
        const { rows } = await db.query(query, [stock, id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en stock' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

/**
 * Eliminación masiva de productos. Se espera un body con:
 * { "productIds": [1, 2, 3] }
 */
const deleteMultipleProducts = async (req, res, next) => {
    try {
        const { productIds } = req.body;
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ error: 'Se requiere un arreglo de productIds' });
        }
        const query = `
      DELETE FROM ${schema}.products
      WHERE id = ANY($1::int[])
      RETURNING *
    `;
        const { rows } = await db.query(query, [productIds]);
        res.json({ message: 'Productos eliminados', products: rows });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createProduct,
    getAdminProducts,
    updateProductDetails,
    updateStock,
    deleteMultipleProducts,
};

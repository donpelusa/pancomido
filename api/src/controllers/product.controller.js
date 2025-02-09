// api/src/controllers/product.controller.js

const db = require('../config/db');
const schema = process.env.DB_SCHEMA;
const Product = require('../models/Product');

// Endpoint para listar productos públicos con filtros
const getProducts = async (req, res, next) => {
    try {
        let query;
        let params = [];

        // Si se filtra por categoría se deben incluir joins a las tablas de categorías
        if (req.query.category) {
            query = `
        SELECT DISTINCT p.*, pi.url_img
        FROM ${schema}.products p
        LEFT JOIN (
          SELECT DISTINCT ON (id_product) id_product, url_img
          FROM ${schema}.product_img
          ORDER BY id_product, id
        ) pi ON p.id = pi.id_product
        JOIN ${schema}.categories_products cp ON p.id = cp.id_product
        JOIN ${schema}.categories c ON cp.id_category = c.id
        WHERE p.available = true
      `;
            params.push(req.query.category);
            query += ` AND c.category = $${params.length}`;
            if (req.query.search) {
                params.push(`%${req.query.search}%`);
                query += ` AND (p.product ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
            }
        } else {
            // Consulta básica sin filtro de categoría
            query = `
        SELECT p.*, pi.url_img
        FROM ${schema}.products p
        LEFT JOIN (
          SELECT DISTINCT ON (id_product) id_product, url_img
          FROM ${schema}.product_img
          ORDER BY id_product, id
        ) pi ON p.id = pi.id_product
        WHERE p.available = true
      `;
            if (req.query.search) {
                params.push(`%${req.query.search}%`);
                query += ` AND (p.product ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
            }
        }
        query += ' ORDER BY p.id';

        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// Endpoint para la vista detalle de producto con información extendida
const getProductDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Obtener la información básica del producto y el stock actual
        const productQuery = `
          SELECT p.*, 
                 (SELECT stock FROM ${schema}.stock WHERE id_product = p.id) AS stock
          FROM ${schema}.products p
          WHERE p.id = $1
        `;
        const productResult = await db.query(productQuery, [id]);
        const product = productResult.rows[0];
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        // Obtener todas las imágenes del producto
        const imagesQuery = `
          SELECT url_img FROM ${schema}.product_img
          WHERE id_product = $1
          ORDER BY id
        `;
        const imagesResult = await db.query(imagesQuery, [id]);
        product.images = imagesResult.rows.map(row => row.url_img);

        // Obtener las categorías a las que pertenece el producto
        const categoriesQuery = `
          SELECT c.category
          FROM ${schema}.categories c
          JOIN ${schema}.categories_products cp ON c.id = cp.id_category
          WHERE cp.id_product = $1
        `;
        const categoriesResult = await db.query(categoriesQuery, [id]);
        product.categories = categoriesResult.rows.map(row => row.category);

        // Se conserva el valor real de nutrition proveniente de la BD
        // (Eliminar la línea que asignaba null)

        // Obtener productos relacionados basados en la primera categoría (si existe)
        if (product.categories.length > 0) {
            const relatedQuery = `
              SELECT DISTINCT p.id, p.product, pi.url_img
              FROM ${schema}.products p
              LEFT JOIN (
                SELECT DISTINCT ON (id_product) id_product, url_img
                FROM ${schema}.product_img
                ORDER BY id_product, id
              ) pi ON p.id = pi.id_product
              JOIN ${schema}.categories_products cp ON p.id = cp.id_product
              JOIN ${schema}.categories c ON cp.id_category = c.id
              WHERE c.category = $1
                AND p.id <> $2
                AND p.available = true
              LIMIT 5
            `;
            const relatedResult = await db.query(relatedQuery, [product.categories[0], id]);
            product.related = relatedResult.rows;
        } else {
            product.related = [];
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
};


const createProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await Product.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(updatedProduct);
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await Product.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(deletedProduct);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProducts,
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct,
};

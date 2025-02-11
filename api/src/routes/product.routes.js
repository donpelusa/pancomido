// src/routes/product.routes.js

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para el catálogo de productos
 *
 * /products:
 *   get:
 *     summary: Listar productos públicos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtro por categoría
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre o descripción)
 *     responses:
 *       200:
 *         description: Lista de productos disponibles.
 *
 * /products/{id}:
 *   get:
 *     summary: Obtener detalle de un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto.
 *     responses:
 *       200:
 *         description: Detalle del producto, incluyendo imágenes, categorías y stock.
 *       404:
 *         description: Producto no encontrado.
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller'); // Funciones públicas

// Rutas públicas
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetail);

module.exports = router;

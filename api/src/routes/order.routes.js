// src/routes/order.routes.js

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints para gestionar órdenes de compra
 *
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos para crear la orden
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_address:
 *                 type: integer
 *               order_delivery_date:
 *                 type: string
 *                 format: date
 *               order_address:
 *                 type: string
 *               order_city:
 *                 type: string
 *               order_region:
 *                 type: string
 *               order_postal_code:
 *                 type: string
 *               order_phone:
 *                 type: string
 *             example:
 *               id_address: 2
 *               order_delivery_date: "2025-02-15"
 *               order_address: "Calle Falsa 123"
 *               order_city: "Ciudad"
 *               order_region: "Región"
 *               order_postal_code: "12345"
 *               order_phone: "987654321"
 *     responses:
 *       201:
 *         description: Orden creada.
 *
 *   get:
 *     summary: Listar órdenes del usuario
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes.
 *
 * /orders/detailed:
 *   get:
 *     summary: Obtener órdenes con detalle (incluye productos y totales)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Órdenes detalladas.
 *
 * /orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a obtener.
 *     responses:
 *       200:
 *         description: Detalle de la orden.
 *       404:
 *         description: Orden no encontrada.
 *
 * /orders/checkout:
 *   post:
 *     summary: Confirmar compra (checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos para procesar la compra, incluyendo items
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_address:
 *                 type: integer
 *               order_delivery_date:
 *                 type: string
 *                 format: date
 *               order_address:
 *                 type: string
 *               order_city:
 *                 type: string
 *               order_region:
 *                 type: string
 *               order_postal_code:
 *                 type: string
 *               order_phone:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     units:
 *                       type: integer
 *                     unit_price:
 *                       type: number
 *             example:
 *               id_address: 2
 *               order_delivery_date: "2025-02-15"
 *               order_address: "Calle Falsa 123"
 *               order_city: "Ciudad"
 *               order_region: "Región"
 *               order_postal_code: "12345"
 *               order_phone: "987654321"
 *               items:
 *                 - productId: 1
 *                   units: 2
 *                   unit_price: 100
 *                 - productId: 3
 *                   units: 1
 *                   unit_price: 250
 *     responses:
 *       201:
 *         description: Orden procesada exitosamente.
 *       400:
 *         description: Error en el procesamiento de la orden.
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { validateToken } = require('../middlewares/validateToken');

// Endpoint para obtener las órdenes detalladas
router.get('/detailed', validateToken, orderController.getDetailedOrders);

// Luego la ruta con parámetro para obtener una orden por id
router.get('/:id', validateToken, orderController.getOrderById);

// Otros endpoints de órdenes
router.post('/', validateToken, orderController.createOrder);
router.get('/', validateToken, orderController.getOrders);

// Nuevo endpoint para confirmar la compra (checkout)
router.post('/checkout', validateToken, orderController.confirmPurchase);

module.exports = router;

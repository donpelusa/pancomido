// src/routes/gateways.routes.js

/**
 * @swagger
 * tags:
 *   name: Gateways
 *   description: Endpoints para gestionar pagos
 *
 * /gateways/payments:
 *   post:
 *     summary: Crear un pago
 *     tags: [Gateways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del pago
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *             example:
 *               amount: 500
 *               currency: "USD"
 *     responses:
 *       201:
 *         description: Pago creado exitosamente.
 */

const express = require('express');
const router = express.Router();
const gatewaysController = require('../controllers/gateways.controller');
const { validateToken } = require('../middlewares/validateToken');

router.post('/payments', validateToken, gatewaysController.createPayment);

module.exports = router;

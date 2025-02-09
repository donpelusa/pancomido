// api/src/routes/address.routes.js

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Endpoints para la gestión de direcciones
 *
 * /address:
 *   post:
 *     summary: Crear una nueva dirección
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto con los datos de la dirección a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_city:
 *                 type: integer
 *               address:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               main:
 *                 type: boolean
 *             example:
 *               id_city: 1
 *               address: "Calle Falsa 123"
 *               postal_code: "12345"
 *               main: true
 *     responses:
 *       201:
 *         description: Dirección creada correctamente.
 *       401:
 *         description: No autenticado.
 *
 *   get:
 *     summary: Listar direcciones del usuario
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de direcciones.
 *
 * /address/{id}:
 *   put:
 *     summary: Actualizar una dirección existente
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a actualizar.
 *     requestBody:
 *       description: Datos actualizados de la dirección
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_city:
 *                 type: integer
 *               address:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               main:
 *                 type: boolean
 *             example:
 *               id_city: 2
 *               address: "Calle Nueva 456"
 *               postal_code: "67890"
 *               main: false
 *     responses:
 *       200:
 *         description: Dirección actualizada correctamente.
 *       404:
 *         description: Dirección no encontrada.
 *
 *   delete:
 *     summary: Eliminar una dirección
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a eliminar.
 *     responses:
 *       200:
 *         description: Dirección eliminada.
 *       404:
 *         description: Dirección no encontrada.
 */

const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const { validateToken } = require('../middlewares/validateToken');

// Crear dirección
router.post('/', validateToken, addressController.createAddress);

// Listar direcciones
router.get('/', validateToken, addressController.getAddresses);

// Actualizar dirección
router.put('/:id', validateToken, addressController.updateAddress);

// Eliminar dirección
router.delete('/:id', validateToken, addressController.deleteAddress);

module.exports = router;

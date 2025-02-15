// src/routes/location.routes.js
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Endpoints para la gestión de direcciones y datos de ubicación.
 *
 * /location/all:
 *   get:
 *     summary: Obtiene todas las regiones, provincias y ciudades ordenadas por ID.
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Objeto con las colecciones de regiones, provincias y ciudades.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 regions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       region:
 *                         type: string
 *                 provinces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       province:
 *                         type: string
 *                       id_region:
 *                         type: integer
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       city:
 *                         type: string
 *                       id_province:
 *                         type: integer
 */

const express = require('express');
const router = express.Router();
const { getAllLocationData } = require('../controllers/location.controller');
const { validateToken } = require('../middlewares/validateToken');

router.get('/all', validateToken, getAllLocationData);

module.exports = router;

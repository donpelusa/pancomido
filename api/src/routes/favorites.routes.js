// api/src/routes/favorites.routes.js

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Endpoints para gestionar los favoritos de un usuario
 *
 * /favorites:
 *   post:
 *     summary: Agregar un producto a favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto que contiene el productId a agregar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *             example:
 *               productId: 1
 *     responses:
 *       201:
 *         description: Producto agregado a favoritos.
 *
 *   delete:
 *     summary: Remover un producto de favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto que contiene el productId a remover
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *             example:
 *               productId: 1
 *     responses:
 *       200:
 *         description: Favorito removido.
 *
 *   get:
 *     summary: Listar los productos favoritos del usuario
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos favoritos.
 */

const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const { validateToken } = require('../middlewares/validateToken');

router.post('/', validateToken, favoritesController.addFavorite);
router.delete('/', validateToken, favoritesController.removeFavorite);
router.get('/', validateToken, favoritesController.listFavorites);

module.exports = router;


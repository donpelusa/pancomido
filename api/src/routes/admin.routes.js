// src/routes/admin.routes.js

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Endpoints para administración de la aplicación
 *
 * /admin/dashboard:
 *   get:
 *     summary: Obtener el resumen de la tienda (ventas, stock y pedidos del mes)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen del dashboard.
 *       401:
 *         description: Token inválido o no proporcionado.
 *
 * /admin/orders/pending:
 *   get:
 *     summary: Listar los pedidos pendientes (no finalizados)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos pendientes.
 *
 * /admin/orders/historical:
 *   get:
 *     summary: Listar los pedidos históricos (finalizados)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos históricos.
 *
 * /admin/users:
 *   get:
 *     summary: Listar usuarios registrados
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *
 * /admin/users/{userId}/role:
 *   put:
 *     summary: Cambiar el rol de un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario.
 *     requestBody:
 *       description: Nuevo rol del usuario ("customer", "admin" o "developer")
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *             example:
 *               role: "admin"
 *     responses:
 *       200:
 *         description: Rol actualizado.
 *       404:
 *         description: Usuario no encontrado.
 *
 * /admin/users/{userId}/disable:
 *   put:
 *     summary: Desactivar un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a desactivar.
 *     responses:
 *       200:
 *         description: Usuario desactivado.
 *       404:
 *         description: Usuario no encontrado.
 *
 * /admin/users/{userId}/enable:
 *   put:
 *     summary: Habilitar (reactivar) un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a habilitar.
 *     responses:
 *       200:
 *         description: Usuario habilitado.
 *       404:
 *         description: Usuario no encontrado.
 *
 * /admin/users/{userId}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado.
 *       404:
 *         description: Usuario no encontrado.
 *
 * /admin/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del producto y stock inicial
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               price:
 *                 type: number
 *               ingredients:
 *                 type: string
 *               weight:
 *                 type: number
 *               nutrition:
 *                 type: string
 *               available:
 *                 type: boolean
 *               stock:
 *                 type: number
 *             example:
 *               product: "Pan Artesanal"
 *               price: 250
 *               ingredients: "Harina, agua, levadura"
 *               weight: 0.5
 *               nutrition: "Alto en fibra"
 *               available: true
 *               stock: 100
 *     responses:
 *       201:
 *         description: Producto creado.
 *   get:
 *     summary: Listar productos para administración (con imagen y stock)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos.
 *   delete:
 *     summary: Eliminación masiva de productos
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Arreglo con los IDs de los productos a eliminar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               productIds: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Productos eliminados.
 *
 * /admin/products/{id}:
 *   put:
 *     summary: Actualizar los datos de un producto (incluye categorías)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar.
 *     requestBody:
 *       description: Datos del producto a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               price:
 *                 type: number
 *               ingredients:
 *                 type: string
 *               weight:
 *                 type: number
 *               nutrition:
 *                 type: string
 *               available:
 *                 type: boolean
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               product: "Pan Integral"
 *               price: 300
 *               ingredients: "Harina integral, agua, levadura"
 *               weight: 0.5
 *               nutrition: "Rico en fibra"
 *               available: true
 *               categories: ["Integral", "Saludable"]
 *     responses:
 *       200:
 *         description: Producto actualizado.
 *
 * /admin/products/{id}/stock:
 *   put:
 *     summary: Actualizar el stock de un producto
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto.
 *     requestBody:
 *       description: Nuevo stock del producto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: number
 *             example:
 *               stock: 150
 *     responses:
 *       200:
 *         description: Stock actualizado.
 */

const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');
const isAdmin = require('../middlewares/isAdmin');

// Rutas existentes para dashboard, pedidos y usuarios...
const adminDashboardController = require('../controllers/adminDashboard.controller');
const orderController = require('../controllers/order.controller');
const adminUsersController = require('../controllers/adminUsers.controller');

// Agregamos las rutas para la gestión de productos en admin
const adminProductsController = require('../controllers/adminProducts.controller');

// Dashboard de administración
router.get('/dashboard', validateToken, isAdmin, adminDashboardController.getDashboardSummary);

// Pedidos pendientes e históricos para admin
router.get('/orders/pending', validateToken, isAdmin, orderController.getAdminPendingOrders);
router.get('/orders/historical', validateToken, isAdmin, orderController.getAdminHistoricalOrders);

// Gestión de usuarios para admin
router.get('/users', validateToken, isAdmin, adminUsersController.listUsers);
router.put('/users/:userId/role', validateToken, isAdmin, adminUsersController.updateUserRole);
router.put('/users/:userId/disable', validateToken, isAdmin, adminUsersController.disableUser);
router.put('/users/:userId/enable', validateToken, isAdmin, adminUsersController.enableUser);
router.delete('/users/:userId', validateToken, isAdmin, adminUsersController.deleteUser);

// Rutas de productos para admin
router.post('/products', validateToken, isAdmin, adminProductsController.createProduct);
router.put('/products/:id', validateToken, isAdmin, adminProductsController.updateProductDetails);
router.put('/products/:id/stock', validateToken, isAdmin, adminProductsController.updateStock);
router.delete('/products', validateToken, isAdmin, adminProductsController.deleteMultipleProducts);
router.get('/products', validateToken, isAdmin, adminProductsController.getAdminProducts);

module.exports = router;

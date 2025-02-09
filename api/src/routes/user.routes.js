// api/src/routes/user.routes.js

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints para gestionar el perfil del usuario
 *
 * /profile:
 *   get:
 *     summary: Obtener los datos del perfil del usuario y su dirección principal
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario y dirección principal.
 *       404:
 *         description: Usuario no encontrado.
 *
 *   put:
 *     summary: Actualizar los datos personales del usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos a actualizar (name, lastname, mail, password, phone, rut)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               rut:
 *                 type: string
 *             example:
 *               name: "Juan"
 *               lastname: "Pérez"
 *               mail: "juan@example.com"
 *               password: "nuevoPassword123"
 *               phone: "12345678"
 *               rut: "12.345.678-9"
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente.
 *       400:
 *         description: Error en la validación (ej. correo o RUT duplicado).
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateToken } = require('../middlewares/validateToken');

// Endpoint para obtener el perfil (MiCuenta)
router.get('/', validateToken, userController.getProfile);

// Endpoint para actualizar los datos personales (MisDatos)
router.put('/', validateToken, userController.updateProfile);

module.exports = router;

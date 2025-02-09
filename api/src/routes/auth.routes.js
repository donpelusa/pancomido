// api/src/routes/auth.routes.js

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación de usuarios
 *
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       description: Datos del usuario a registrar
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
 *             example:
 *               name: "Juan"
 *               lastname: "Pérez"
 *               mail: "juan@example.com"
 *               password: "secret123"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Error en los campos requeridos.
 *
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       description: Credenciales del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               mail: "juan@example.com"
 *               password: "secret123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, retorna un token JWT.
 *       401:
 *         description: Credenciales inválidas.
 *
 * /auth/test:
 *   get:
 *     summary: Ruta de prueba para autenticación
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Ruta de prueba funcionando.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// // Opcional: para confirmar que el archivo se carga, agrega un log
// console.log('auth.routes cargado');

// Endpoint para registrar usuario
router.post('/register', authController.register);
// Endpoint para login
router.post('/login', authController.login);

// También puedes agregar una ruta de prueba temporal:
router.get('/test', (req, res) => res.json({ message: 'Ruta de prueba auth funcionando' }));


module.exports = router;

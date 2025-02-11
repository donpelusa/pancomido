/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints de autenticación y reseteo de contraseña
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
 *
 * /auth/reset-password/request:
 *   post:
 *     summary: Solicitar reseteo de contraseña
 *     description: Genera y envía un código de 6 dígitos a la cuenta de correo del usuario. El código es válido por 5 minutos.
 *     tags: [Auth]
 *     requestBody:
 *       description: Email del usuario para el reseteo.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Código enviado.
 *       404:
 *         description: Usuario no encontrado.
 *
 * /auth/reset-password/confirm:
 *   post:
 *     summary: Confirmar reseteo de contraseña
 *     description: Valida el código enviado y permite cambiar la contraseña.
 *     tags: [Auth]
 *     requestBody:
 *       description: Se requiere enviar el email, el código recibido y la nueva contraseña.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               resetCode:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               email: "usuario@example.com"
 *               resetCode: "123456"
 *               newPassword: "nuevaContraseña123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente.
 *       400:
 *         description: Código inválido o expirado.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Endpoint para registrar usuario
router.post('/register', authController.register);
// Endpoint para login
router.post('/login', authController.login);
// Ruta de prueba
router.get('/test', (req, res) => res.json({ message: 'Ruta de prueba auth funcionando' }));
// Rutas para reseteo de contraseña
router.post('/reset-password/request', authController.resetPasswordRequest);
router.post('/reset-password/confirm', authController.resetPasswordConfirm);

module.exports = router;

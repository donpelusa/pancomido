// src/controllers/auth.controller.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const crypto = require('crypto');
const SALT_ROUNDS = 10;

// Control de registro
const register = async (req, res, next) => {
    try {
        console.log("Registro iniciado:", req.body);
        const { name, lastname, mail, password } = req.body;
        if (!name || !lastname || !mail || !password) {
            console.log("Faltan campos requeridos");
            return res.status(400).json({ error: 'Faltan campos requeridos: name, lastname, mail y password.' });
        }

        console.log("Buscando usuario existente por mail:", mail);
        const existingUser = await User.findUserByMail(mail);
        console.log("Resultado de findUserByMail:", existingUser);

        if (existingUser) {
            console.log("El usuario ya existe.");
            return res.status(400).json({ error: 'El usuario ya existe.' });
        }

        console.log("Creando nuevo usuario");
        const newUser = await User.createUser({ name, lastname, mail, password });
        console.log("Usuario creado:", newUser);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Error en registro:", err);
        next(err);
    }
};

// Control de acceso
const login = async (req, res, next) => {
    try {
        const { mail, password } = req.body;
        const user = await User.findUserByMail(mail);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        const token = require('../models/Auth').generateToken(user);
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

/**
 * Reset Password Request
 * Genera un código de 6 dígitos y lo envía al correo del usuario.
 */
const resetPasswordRequest = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'El campo email es requerido.' });
        }
        // Verificar que el usuario existe
        const user = await User.findUserByMail(email);
        if (!user) {
            return res.status(404).json({ error: 'No se encontró un usuario con ese email.' });
        }
        // Generar código aleatorio de 6 dígitos
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Calcular la expiración: ahora + 5 minutos
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Insertar la solicitud en la tabla password_reset_requests
        const query = `
        INSERT INTO ${process.env.DB_SCHEMA}.password_reset_requests (email, reset_code, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
        const { rows } = await db.query(query, [email, resetCode, expiresAt]);

        // Simular el envío de correo (en producción integrar con un servicio de email)
        console.log(`Se envió el código de reseteo ${resetCode} a ${email}`);

        res.status(200).json({ message: 'Código de reseteo enviado. Valido por 5 minutos.' });
    } catch (err) {
        next(err);
    }
};

/**
 * Reset Password Confirm
 * Valida el código y actualiza la contraseña del usuario.
 */
const resetPasswordConfirm = async (req, res, next) => {
    try {
        const { email, resetCode, newPassword } = req.body;
        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({ error: 'Se requieren email, resetCode y newPassword.' });
        }
        // Buscar la solicitud de reseteo para este email y código
        const query = `
        SELECT * FROM ${process.env.DB_SCHEMA}.password_reset_requests
        WHERE email = $1 AND reset_code = $2
        LIMIT 1
      `;
        const { rows } = await db.query(query, [email, resetCode]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Código inválido o no existe.' });
        }
        const requestEntry = rows[0];
        // Verificar si el código está expirado
        if (new Date() > new Date(requestEntry.expires_at)) {
            // Eliminar la solicitud vencida
            await db.query(
                `DELETE FROM ${process.env.DB_SCHEMA}.password_reset_requests WHERE id = $1`,
                [requestEntry.id]
            );
            return res.status(400).json({ error: 'El código ha expirado.' });
        }
        // Si es válido, actualizar la contraseña del usuario
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        const updateQuery = `
        UPDATE ${process.DB_SCHEMA}.users
        SET password = $1, updated_at = NOW()
        WHERE mail = $2
        RETURNING id, name, mail
      `;
        const updateResult = await db.query(updateQuery, [hashedPassword, email]);
        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        // Eliminar la solicitud de reseteo una vez que se actualizó la contraseña
        await db.query(
            `DELETE FROM ${process.env.DB_SCHEMA}.password_reset_requests WHERE id = $1`,
            [requestEntry.id]
        );
        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    resetPasswordRequest,
    resetPasswordConfirm
};

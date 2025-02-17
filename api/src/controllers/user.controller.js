// src/controllers/user.controller.js

const User = require('../models/User');
const Address = require('../models/Address');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const { validaRut } = require('../helpers/validateRut.helper');

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Obtener datos del usuario
        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Obtener la dirección principal
        const mainAddress = await Address.getMainAddress(userId);
        return res.json({ user, mainAddress });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Extraer campos permitidos
        const { name, lastname, mail, password, phone, rut } = req.body;

        // Validar teléfono: debe contener EXACTAMENTE 9 dígitos (sólo números)
        if (phone && !/^\d{9}$/.test(phone)) {
            return res.status(400).json({ error: 'El teléfono debe contener exactamente 9 números' });
        }

        // Validar RUT si se proporciona:
        if (rut) {
            // Validar formato: 8 dígitos, guión y 1 dígito o "k/K"
            if (!/^\d{8}-[0-9kK]$/.test(rut)) {
                return res.status(400).json({ error: 'Formato Incorrecto. Ej: 99999999-9' });
            }
            // Validar lógica del RUT
            if (!validaRut(rut)) {
                return res.status(400).json({ error: 'RUT no válido. Intenta nuevamente' });
            }
        }

        // Validar que el RUT no esté en uso por otro usuario
        const existingUserByRut = await User.findUserByRut(rut);
        if (existingUserByRut && existingUserByRut.id !== userId) {
            return res.status(400).json({ error: 'El RUT ya está en uso' });
        }

        // Validar que el correo no esté en uso por otro usuario
        const existingUserByMail = await User.findUserByMail(mail);
        if (existingUserByMail && existingUserByMail.id !== userId) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }

        // Preparar el objeto de actualización
        const updatedData = { name, lastname, mail, phone, rut };

        // Si se envía password, hashearlo y agregarlo al objeto de actualización
        if (password && password.trim().length > 0) {
            updatedData.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const updatedUser = await User.updateUser(userId, updatedData);
        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile,
    updateProfile,
};

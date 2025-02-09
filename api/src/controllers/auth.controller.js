// api/src/controllers/auth.controller.js

const User = require('../models/User');
const bcrypt = require('bcrypt');

// Control de registro
const register = async (req, res, next) => {
    try {
        const { name, lastname, mail, password } = req.body;

        if (!name || !lastname || !mail || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos: name, lastname, mail y password.' });
        }

        const existingUser = await User.findUserByMail(mail);
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe.' });
        }

        const newUser = await User.createUser({ name, lastname, mail, password });
        res.status(201).json(newUser);
    } catch (err) {
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

module.exports = {
    register,
    login,
};

// src/controllers/auth.controller.js

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const db = require("../config/db");
const User = require('../models/User');

// Control de registro
const register = async (req, res, next) => {
    try {
        console.log("Registro iniciado:", req.body);
        const { name, lastname, mail, password } = req.body;
        if (!name || !lastname || !mail || !password) {
            console.log("Faltan campos requeridos");
            return res.status(400).json({ error: 'Faltan campos requeridos: name, lastname, mail y password.' });
        }

        // console.log("Buscando usuario existente por mail:", mail);
        const existingUser = await User.findUserByMail(mail);
        // console.log("Resultado de findUserByMail:", existingUser);

        if (existingUser) {
            console.log("El usuario ya existe.");
            return res.status(400).json({ error: 'El usuario ya existe.' });
        }

        // console.log("Creando nuevo usuario");
        const newUser = await User.createUser({ name, lastname, mail, password });
        // console.log("Usuario creado:", newUser);
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

module.exports = {
    register,
    login,
};

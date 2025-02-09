// api/src/controllers/adminUsers.controller.js

/*
    * Controladores para la administración de usuarios.
*/

const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

// Listar todos los usuarios
const listUsers = async (req, res, next) => {
    try {
        const query = `SELECT id, rut, name, mail
            FROM ${schema}.users
            ORDER BY created_at DESC`;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// Actualizar el rol de un usuario
const updateUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body; // 'customer' o 'admin' o 'developer'
        const query = `UPDATE ${schema}.users
            SET role_id = (SELECT id FROM ${schema}.roles WHERE role = $1),
            updated_at = NOW()
            WHERE id = $2
            RETURNING id, name, mail, role_id`;
        const { rows } = await db.query(query, [role, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// Desactivar un usuario
const disableUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        // Se asume que en la tabla users exista un campo 'disabled'
        const query = `UPDATE ${schema}.users
            SET disabled = true,
            updated_at = NOW()
            WHERE id = $1
            RETURNING id, name, mail, disabled`;
        const { rows } = await db.query(query, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// Habilitar un usuario (reactivar)
const enableUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const query = `UPDATE ${schema}.users
            SET disabled = false,
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, name, mail, disabled`;
        const { rows } = await db.query(query, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// Borrar un usuario
const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const query = `DELETE FROM ${schema}.users
            WHERE id = $1
            RETURNING id, name, mail`;
        const { rows } = await db.query(query, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado', user: rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listUsers,
    updateUserRole,
    disableUser,
    enableUser,
    deleteUser,
};

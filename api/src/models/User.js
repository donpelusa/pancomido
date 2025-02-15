// backend/src/models/User.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const schema = process.env.DB_SCHEMA;

const createUser = async (userData) => {
    if (!userData.password) {
        throw new Error("Password is required");
    }
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const query = `
      INSERT INTO ${schema}.users (name, lastname, mail, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, lastname, mail, password, role_id, created_at, updated_at
    `;
    const values = [
        userData.name,
        userData.lastname,
        userData.mail,
        hashedPassword
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const updateUser = async (id, userData) => {
    const query = `
      UPDATE ${schema}.users
      SET name = $1,
          lastname = $2,
          mail = $3,
          password = COALESCE($4, password),
          phone = $5,
          rut = $6,
          updated_at = NOW()
      WHERE id = $7
      RETURNING id, name, lastname, mail, phone, rut, role_id, created_at, updated_at
    `;
    const values = [
        userData.name,
        userData.lastname,
        userData.mail,
        userData.password || null, // si no se envía password, se mantiene el valor anterior
        userData.phone,
        userData.rut,
        id,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const findUserByRut = async (rut) => {
    const query = `
      SELECT u.id, u.name, u.lastname, u.mail, u.password, u.role_id, u.phone, u.rut, u.created_at, u.updated_at,
             r.role as role
      FROM ${schema}.users u
      LEFT JOIN ${schema}.roles r ON u.role_id = r.id
      WHERE rut = $1
    `;
    const { rows } = await db.query(query, [rut]);
    return rows[0];
};

const findUserByMail = async (mail) => {
    const query = `
      SELECT u.id, u.name, u.lastname, u.mail, u.password, u.role_id, u.phone, u.rut, u.created_at, u.updated_at,
             r.role as role
      FROM ${schema}.users u
      LEFT JOIN ${schema}.roles r ON u.role_id = r.id
      WHERE u.mail = $1
    `;
    const { rows } = await db.query(query, [mail]);
    return rows[0];
};

const findUserById = async (id) => {
    const query = `
      SELECT u.id, u.name, u.lastname, u.mail, u.password, u.role_id, u.phone, u.rut, u.created_at, u.updated_at,
             r.role as role
      FROM ${schema}.users u
      LEFT JOIN ${schema}.roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

module.exports = {
    createUser,
    findUserByMail,
    findUserById,
    updateUser,
    findUserByRut,
};

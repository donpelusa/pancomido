// src/controllers/categories.controller.js
const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

const getCategories = async (req, res, next) => {
    try {
        const query = `SELECT id, category FROM ${schema}.categories ORDER BY category`;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { getCategories };

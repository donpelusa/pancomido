// src/controllers/location.controller.js
const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

/**
 * Obtiene todas las regiones, provincias y ciudades ordenadas por ID.
 */
const getAllLocationData = async (req, res, next) => {
    try {
        // Consultas para cada tabla, ordenadas por ID
        const regionsQuery = `SELECT id, region FROM ${schema}.regions ORDER BY id`;
        const provincesQuery = `SELECT id, province, id_region FROM ${schema}.provinces ORDER BY id`;
        const citiesQuery = `SELECT id, city, id_province FROM ${schema}.cities ORDER BY id`;

        const regionsResult = await db.query(regionsQuery);
        const provincesResult = await db.query(provincesQuery);
        const citiesResult = await db.query(citiesQuery);

        res.json({
            regions: regionsResult.rows,
            provinces: provincesResult.rows,
            cities: citiesResult.rows,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllLocationData,
    // ...otras funciones (si las hubiera)
};

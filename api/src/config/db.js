// src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false, // Esto evita la validación estricta del certificado
    }
});

// Al conectar, configurar el search_path si se ha definido un esquema en el .env
pool.on('connect', (client) => {
    client.query('SET search_path TO pancomido', (err) => {
        if (err) {
            console.error('Error setting search_path:', err);
        }
        console.log("Usando schema:", process.env.DB_SCHEMA);

    });
});

pool.on('error', (err, client) => {
    console.error('Error inesperado en el pool de conexiones', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};

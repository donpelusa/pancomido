// api/src/models/Favorites.js

const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

const addFavorite = async (userId, productId) => {
  const query = `
    INSERT INTO ${schema}.favorites (id_user, id_product)
    VALUES ($1, $2)
    ON CONFLICT (id_user, id_product) DO NOTHING
    RETURNING *
  `;
  const { rows } = await db.query(query, [userId, productId]);
  return rows[0];
};

const removeFavorite = async (userId, productId) => {
  const query = `
    DELETE FROM ${schema}.favorites
    WHERE id_user = $1 AND id_product = $2
    RETURNING *
  `;
  const { rows } = await db.query(query, [userId, productId]);
  return rows[0];
};

const getFavorites = async (userId) => {
  const query = `
    SELECT p.*
    FROM ${schema}.favorites f
    JOIN ${schema}.products p ON f.id_product = p.id
    WHERE f.id_user = $1 AND p.available = true
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};


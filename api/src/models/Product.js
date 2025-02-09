// api/src/models/Product.js

const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

const getAllProducts = async () => {
  const query = `
    SELECT id, product, ingredients, price, weight, description, created_at, updated_at
    FROM ${schema}.products
  `;
  const { rows } = await db.query(query);
  return rows;
};

const getProductById = async (id) => {
  const query = `
    SELECT id, product, ingredients, price, weight, description, created_at, updated_at
    FROM ${schema}.products
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const createProduct = async (productData) => {
  const query = `
      INSERT INTO ${schema}.products (product, ingredients, price, weight, description, available)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
  const values = [
    productData.product,
    productData.ingredients || null,
    productData.price,
    productData.weight || null,
    productData.description || null,
    productData.available !== undefined ? productData.available : true
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const createStock = async (productId, stockValue) => {
  const query = `
      INSERT INTO ${schema}.stock (id_product, stock)
      VALUES ($1, $2)
      RETURNING *
    `;
  const values = [productId, stockValue];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const updateProduct = async (id, productData) => {
  const query = `
    UPDATE ${schema}.products
    SET product = $1,
        ingredients = $2,
        price = $3,
        weight = $4,
        description = $5,
        updated_at = NOW()
    WHERE id = $6
    RETURNING *
  `;
  const values = [
    productData.product,
    productData.ingredients || null,
    productData.price,
    productData.weight || null,
    productData.description || null,
    id,
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const deleteProduct = async (id) => {
  const query = `DELETE FROM ${schema}.products WHERE id = $1 RETURNING *`;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  createStock,
  updateProduct,
  deleteProduct,
};

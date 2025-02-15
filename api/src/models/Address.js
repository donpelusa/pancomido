// src/models/Address.js
const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

const createAddress = async (addressData) => {
  const query = `
    INSERT INTO ${schema}.address (id_user, id_city, address, postal_code, main)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [
    addressData.id_user,
    addressData.id_city,
    addressData.address,
    addressData.postal_code || null,
    addressData.main || false,
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const getMainAddress = async (id_user) => {
  const query = `
    SELECT 
      a.*,
      c.city AS city,
      c.id AS cityId,
      p.province AS province,
      p.id AS provinceId,
      r.region AS region,
      r.id AS regionId
    FROM ${schema}.address a
    JOIN ${schema}.cities c ON a.id_city = c.id
    JOIN ${schema}.provinces p ON c.id_province = p.id
    JOIN ${schema}.regions r ON p.id_region = r.id
    WHERE a.id_user = $1 AND a.main = true
    LIMIT 1
  `;
  const { rows } = await db.query(query, [id_user]);
  return rows[0];
};

const getAddresses = async (id_user) => {
  const query = `
    SELECT 
      a.*,
      c.city AS city,
      c.id AS cityId,
      p.province AS province,
      p.id AS provinceId,
      r.region AS region,
      r.id AS regionId
    FROM ${schema}.address a
    JOIN ${schema}.cities c ON a.id_city = c.id
    JOIN ${schema}.provinces p ON c.id_province = p.id
    JOIN ${schema}.regions r ON p.id_region = r.id
    WHERE a.id_user = $1
    ORDER BY a.created_at DESC
  `;
  const { rows } = await db.query(query, [id_user]);
  return rows;
};

const getAddressById = async (id, id_user) => {
  const query = `
    SELECT 
      a.*,
      c.city AS city,
      c.id AS cityId,
      p.province AS province,
      p.id AS provinceId,
      r.region AS region,
      r.id AS regionId
    FROM ${schema}.address a
    JOIN ${schema}.cities c ON a.id_city = c.id
    JOIN ${schema}.provinces p ON c.id_province = p.id
    JOIN ${schema}.regions r ON p.id_region = r.id
    WHERE a.id = $1 AND a.id_user = $2
  `;
  const { rows } = await db.query(query, [id, id_user]);
  return rows[0];
};

const updateAddress = async (addressId, id_user, addressData) => {
  const query = `
    UPDATE ${schema}.address
    SET id_city = $1,
        address = $2,
        postal_code = $3,
        main = $4,
        updated_at = NOW()
    WHERE id = $5 AND id_user = $6
    RETURNING *
  `;
  const values = [
    addressData.id_city,
    addressData.address,
    addressData.postal_code || null,
    addressData.main,
    addressId,
    id_user,
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const deleteAddress = async (addressId, id_user) => {
  const query = `
    DELETE FROM ${schema}.address
    WHERE id = $1 AND id_user = $2
    RETURNING *
  `;
  const { rows } = await db.query(query, [addressId, id_user]);
  return rows[0];
};

const unsetMainForOtherAddresses = async (id_user, excludeAddressId = null) => {
  let query, values;
  if (excludeAddressId) {
    query = `
      UPDATE ${schema}.address
      SET main = false, updated_at = NOW()
      WHERE id_user = $1 AND id <> $2
    `;
    values = [id_user, excludeAddressId];
  } else {
    query = `
      UPDATE ${schema}.address
      SET main = false, updated_at = NOW()
      WHERE id_user = $1
    `;
    values = [id_user];
  }
  await db.query(query, values);
};

module.exports = {
  createAddress,
  getMainAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  unsetMainForOtherAddresses,
};

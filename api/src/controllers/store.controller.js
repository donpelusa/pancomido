// backend/src/controllers/store.controller.js
const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

const getStoreSummary = async (req, res, next) => {
    try {

        // Monthly Sales: suma de (units * unit_price_product) de los pedidos creados este mes
        const monthlySalesQuery = `
      SELECT COALESCE(SUM(od.units * od.unit_price_product), 0) AS monthly_sales
      FROM ${schema}.orders o
      JOIN ${schema}.order_detail od ON o.id = od.id_order
      WHERE date_trunc('month', o.created_at) = date_trunc('month', CURRENT_DATE)
    `;
        const monthlySalesResult = await db.query(monthlySalesQuery);
        const monthly_sales = monthlySalesResult.rows[0].monthly_sales;

        // Monthly Orders: contar pedidos creados este mes
        const monthlyOrdersQuery = `
      SELECT COUNT(*) AS monthly_orders
      FROM ${schema}.orders
      WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
    `;
        const monthlyOrdersResult = await db.query(monthlyOrdersQuery);
        const monthly_orders = monthlyOrdersResult.rows[0].monthly_orders;

        // Total available products: contar productos con available = true
        const availableProductsQuery = `
      SELECT COUNT(*) AS total_available_products
      FROM ${schema}.products
      WHERE available = true
    `;
        const availableProductsResult = await db.query(availableProductsQuery);
        const total_available_products = availableProductsResult.rows[0].total_available_products;

        // Total stock: suma de todos los stocks en la tabla stock
        const totalStockQuery = `
      SELECT COALESCE(SUM(stock), 0) AS total_stock
      FROM ${schema}.stock
    `;
        const totalStockResult = await db.query(totalStockQuery);
        const total_stock = totalStockResult.rows[0].total_stock;

        // Registered Users: contar usuarios con role_id = 1 (customers)
        const registeredUsersQuery = `
      SELECT COUNT(*) AS registered_users
      FROM ${schema}.users
      WHERE role_id = 1
    `;
        const registeredUsersResult = await db.query(registeredUsersQuery);
        const registered_users = registeredUsersResult.rows[0].registered_users;

        // Enabled Users: contar clientes (role_id = 1) que tengan rut y phone registrados
        const enabledUsersQuery = `
      SELECT COUNT(*) AS enabled_users
      FROM ${schema}.users
      WHERE role_id = 1 AND rut IS NOT NULL AND phone IS NOT NULL
    `;
        const enabledUsersResult = await db.query(enabledUsersQuery);
        const enabled_users = enabledUsersResult.rows[0].enabled_users;

        // Top 3 Favorites: los 3 productos más agregados a favoritos, concatenados con guiones
        const topFavoritesQuery = `
      SELECT p.product, COUNT(*) AS fav_count
      FROM ${schema}.favorites f
      JOIN ${schema}.products p ON f.id_product = p.id
      GROUP BY p.product
      ORDER BY fav_count DESC
      LIMIT 3
    `;
        const topFavoritesResult = await db.query(topFavoritesQuery);
        const top_favorites = topFavoritesResult.rows.map(row => row.product).join(" - ");

        // Out of Stock Products: productos available = true sin stock o con stock = 0
        const outOfStockQuery = `
      SELECT p.product
      FROM ${schema}.products p
      LEFT JOIN ${schema}.stock s ON p.id = s.id_product
      WHERE p.available = true AND (s.stock IS NULL OR s.stock = 0)
    `;
        const outOfStockResult = await db.query(outOfStockQuery);
        const out_of_stock_products = outOfStockResult.rows.map(row => row.product).join(" - ");

        // Latest 3 Orders: últimos 3 pedidos realizados (ordenados por created_at descendente)
        const latestOrdersQuery = `
      SELECT o.id, o.created_at, o.order_delivery_date, o.order_status_id,
        (SELECT COALESCE(SUM(od.units * od.unit_price_product), 0)
         FROM ${schema}.order_detail od WHERE od.id_order = o.id) AS total
      FROM ${schema}.orders o
      ORDER BY o.created_at DESC
      LIMIT 3
    `;
        const latestOrdersResult = await db.query(latestOrdersQuery);
        const latest_orders = latestOrdersResult.rows;

        res.json({
            monthly_sales,
            monthly_orders,
            total_available_products,
            total_stock,
            registered_users,
            enabled_users,
            top_favorites,
            out_of_stock_products,
            latest_orders
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getStoreSummary };

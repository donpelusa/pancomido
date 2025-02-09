// api/src/controllers/adminDashboard.controller.js

const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

/*
    El dashboard de administrador debe mostrar un resumen de la información más relevante de la tienda.
*/

// Función para obtener el resumen del dashboard
const getDashboardSummary = async (req, res, next) => {
    try {
        // Total de ventas del mes en curso: 
        // se calcula sumando (units * unit_price_product) de cada detalle de orden

        const salesQuery = `SELECT COALESCE(SUM(od.units * od.unit_price_product), 0) AS total_sales 
            FROM ${schema}.orders o JOIN ${schema}.order_detail od ON o.id = od.id_order 
            WHERE date_trunc('month', o.created_at) = date_trunc('month', CURRENT_DATE)`;

        // Stock global
        const stockQuery = `SELECT COALESCE(SUM(stock), 0) AS total_stock FROM ${schema}.stock`;

        // Total de pedidos del mes en curso
        const ordersQuery = `SELECT COUNT(*) AS total_orders FROM ${schema}.orders
            WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)`;

        const salesResult = await db.query(salesQuery);     // Ejecutar la consulta de ventas
        const stockResult = await db.query(stockQuery);     // Ejecutar la consulta de stock
        const ordersResult = await db.query(ordersQuery);   // Ejecutar la consulta de pedidos

        res.json({
            total_sales: salesResult.rows[0].total_sales,       // Retornar el total de ventas
            total_stock: stockResult.rows[0].total_stock,       // Retornar el total de stock
            total_orders: ordersResult.rows[0].total_orders,    // Retornar el total de pedidos
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDashboardSummary,
};

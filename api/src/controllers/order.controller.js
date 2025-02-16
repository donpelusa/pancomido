// src/controllers/order.controller.js

const db = require('../config/db');
const schema = process.env.DB_SCHEMA;
const User = require('../models/User');
const Address = require('../models/Address');


const createOrder = async (req, res, next) => {
    try {
        const id_user = req.user.id;
        const {
            id_address,
            order_delivery_date,
            order_status_id,
            order_address,
            order_city,
            order_region,
            order_postal_code,
            order_phone
        } = req.body;

        const query = `
        INSERT INTO ${schema}.orders (id_user, id_address, order_delivery_date, status, order_address, order_city, order_region, order_postal_code, order_phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
        const values = [
            id_user,
            id_address,
            order_delivery_date,
            order_status_id,
            order_address,
            order_city,
            order_region,
            order_postal_code || null,
            order_phone
        ];
        const { rows } = await db.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { order_status_id } = req.body;
        const query = `
        UPDATE ${process.env.DB_SCHEMA}.orders
        SET order_status_id = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
        const { rows } = await db.query(query, [order_status_id, orderId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const getOrders = async (req, res, next) => {
    try {
        // Endpoint básico para pedidos del cliente
        const id_user = req.user.id;
        const query = `
        SELECT * FROM ${schema}.orders
        WHERE id_user = $1
        ORDER BY created_at DESC
      `;
        const { rows } = await db.query(query, [id_user]);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const id_user = req.user.id;
        const { id } = req.params;
        const query = `
        SELECT * FROM ${schema}.orders
        WHERE id = $1 AND id_user = $2
      `;
        const { rows } = await db.query(query, [id, id_user]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// Endpoint para clientes: Listado detallado de sus pedidos
const getDetailedOrders = async (req, res, next) => {
    try {
        const id_user = req.user.id;
        const query = `
        SELECT 
          o.*,
          u.mail as user_mail,
          COALESCE(SUM(od.units * od.unit_price_product), 0) AS total_purchase,
          json_agg(json_build_object(
            'productId', od.id_product,
            'units', od.units,
            'unit_price', od.unit_price_product,
            'product', p.product,
            'ingredients', p.ingredients
          )) AS products
        FROM ${schema}.orders o
        JOIN ${schema}.users u ON o.id_user = u.id
        LEFT JOIN ${schema}.order_detail od ON o.id = od.id_order
        LEFT JOIN ${schema}.products p ON od.id_product = p.id
        WHERE o.id_user = $1
        GROUP BY o.id, u.mail
        ORDER BY o.created_at DESC
      `;
        const { rows } = await db.query(query, [id_user]);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// Endpoints para administración: Pedidos pendientes y históricos
const getAdminPendingOrders = async (req, res, next) => {
    try {
        // Obtener el id del estado "Finalizada"
        const finalStatusResult = await db.query(
            `SELECT id FROM ${schema}.order_status WHERE status = 'Finalizada'`
        );
        if (finalStatusResult.rows.length === 0) {
            return res.status(500).json({ error: 'No se encontró el estado "Finalizada".' });
        }
        const finalStatusId = finalStatusResult.rows[0].id;

        // Consulta para obtener pedidos pendientes (no Finalizados)
        const query = `
        SELECT 
            o.*, 
            u.name || ' ' || u.lastname AS customer,
            u.mail,
            u.rut,
            json_agg(json_build_object(
                'productId', od.id_product,
                'units', od.units,
                'unit_price', od.unit_price_product
            )) AS products
        FROM ${schema}.orders o
        JOIN ${schema}.users u ON o.id_user = u.id
        LEFT JOIN ${schema}.order_detail od ON o.id = od.id_order
        WHERE o.order_status_id != $1
        GROUP BY o.id, u.name, u.lastname, u.mail, u.rut
        ORDER BY o.created_at DESC
        `;
        const { rows } = await db.query(query, [finalStatusId]);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const getAdminHistoricalOrders = async (req, res, next) => {
    try {
        const query = `
        SELECT o.*, 
               u.name || ' ' || u.lastname AS customer,
               u.mail,
               u.rut,
               json_agg(json_build_object(
                 'productId', od.id_product,
                 'units', od.units,
                 'unit_price', od.unit_price_product
               )) AS products
        FROM ${schema}.orders o
        JOIN ${schema}.users u ON o.id_user = u.id
        LEFT JOIN ${schema}.order_detail od ON o.id = od.id_order
        WHERE o.order_status_id = (SELECT id FROM ${schema}.order_status WHERE status = 'Finalizada')
        GROUP BY o.id, u.name, u.lastname, u.mail, u.rut
        ORDER BY o.created_at DESC
      `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const confirmPurchase = async (req, res, next) => {
    const client = await db.pool.connect();
    try {
        const id_user = req.user.id;
        // Validar que el usuario tenga datos completos (RUT y teléfono) y al menos una dirección registrada
        const user = await User.findUserById(id_user);
        if (!user.rut || !user.phone) {
            return res.status(400).json({ error: 'Para comprar, debe actualizar su perfil con RUT y teléfono.' });
        }
        const addresses = await Address.getAddresses(id_user);
        if (!addresses || addresses.length === 0) {
            return res.status(400).json({ error: 'Para comprar, debe registrar al menos una dirección.' });
        }

        // Iniciar transacción
        await client.query('BEGIN');

        const {
            id_address,
            order_delivery_date,
            order_address,
            order_city,
            order_region,
            order_postal_code,
            order_phone,
            items
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'No se han enviado items para la orden.' });
        }

        // Verificar stock para cada producto (con bloqueo FOR UPDATE)
        const insufficient = [];
        for (const item of items) {
            const { productId, units } = item;
            const stockResult = await client.query(
                `SELECT stock FROM ${schema}.stock WHERE id_product = $1 FOR UPDATE`,
                [productId]
            );
            if (stockResult.rows.length === 0) {
                insufficient.push({ productId, available: 0, requested: units });
            } else {
                const available = stockResult.rows[0].stock;
                if (available < units) {
                    insufficient.push({ productId, available, requested: units });
                }
            }
        }

        if (insufficient.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Stock insuficiente en algunos productos', details: insufficient });
        }

        // Actualizar stock para cada producto
        for (const item of items) {
            const { productId, units } = item;
            await client.query(
                `UPDATE ${schema}.stock SET stock = stock - $1, updated_at = NOW() WHERE id_product = $2`,
                [units, productId]
            );
        }

        // Insertar la orden (se establece el estado inicial en 1, correspondiente a "En revisión" según tu tabla)
        const orderQuery = `
          INSERT INTO ${schema}.orders 
          (id_user, id_address, order_delivery_date, order_status_id, order_address, order_city, order_region, order_postal_code, order_phone)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `;
        const orderValues = [
            id_user,
            id_address,
            order_delivery_date,
            1, // Estado inicial: "En revisión"
            order_address,
            order_city,
            order_region,
            order_postal_code || null,
            order_phone
        ];
        const orderResult = await client.query(orderQuery, orderValues);
        const orderId = orderResult.rows[0].id;

        // Insertar cada detalle de la orden
        for (const item of items) {
            const { productId, units, unit_price } = item;
            const detailQuery = `
              INSERT INTO ${schema}.order_detail (id_order, id_product, units, unit_price_product)
              VALUES ($1, $2, $3, $4)
            `;
            await client.query(detailQuery, [orderId, productId, units, unit_price]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Orden procesada exitosamente', order: orderResult.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};


module.exports = {
    createOrder,
    updateOrderStatus,
    getOrders,
    getOrderById,
    getDetailedOrders,
    getAdminPendingOrders,
    getAdminHistoricalOrders,
    confirmPurchase,
};

// src/routes/productImages.routes.js

/**
 * @swagger
 * tags:
 *   name: Product Images
 *   description: Endpoints para la gestión de imágenes de productos
 *
 * /product-images/save-images:
 *   post:
 *     summary: Guardar las URLs de las imágenes en la base de datos
 *     tags: [Product Images]
 *     requestBody:
 *       description: Objeto que contiene el productId y un arreglo de imágenes (con su URL)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *             example:
 *               productId: 1
 *               images:
 *                 - url: "https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/productos/1/imagen1.jpg"
 *                 - url: "https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/productos/1/imagen2.jpg"
 *     responses:
 *       200:
 *         description: Imágenes guardadas en la base de datos.
 *       400:
 *         description: Datos inválidos.
 */

// src/routes/productImages.routes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const schema = process.env.DB_SCHEMA;
const { validateToken } = require('../middlewares/validateToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/save-images', validateToken, isAdmin, async (req, res, next) => {
    try {
        // Se espera recibir: { productId: number, images: [{ url or secure_url, public_id }, ...] }
        const { productId, images } = req.body;
        if (!productId || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: "Se requiere productId y un arreglo de imágenes" });
        }

        // Filtrar solo imágenes válidas (deben tener URL y public_id)
        const validImages = images.filter(img => img && (img.url || img.secure_url) && img.public_id);
        if (validImages.length === 0) {
            return res.status(400).json({ error: "No hay imágenes válidas para guardar" });
        }

        const insertedImages = [];
        for (const img of validImages) {
            const imageUrl = img.url || img.secure_url;
            const query = `
        INSERT INTO ${schema}.product_img (id_product, url_img, cloudinary_public_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
            const { rows } = await db.query(query, [productId, imageUrl, img.public_id]);
            insertedImages.push(rows[0]);
        }
        res.status(200).json({ message: "Imágenes guardadas correctamente", images: insertedImages });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

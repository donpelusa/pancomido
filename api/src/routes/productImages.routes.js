// api/src/routes/productImages.routes.js

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

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const schema = process.env.DB_SCHEMA;

// Endpoint para guardar las URLs de imágenes en la base de datos
router.post('/save-images', async (req, res, next) => {
    try {
        const { productId, images } = req.body;
        // Validar que se haya enviado productId y un arreglo de imágenes
        if (!productId || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: 'Se requieren productId y un arreglo de imágenes' });
        }

        // Inserción masiva en la tabla product_img para cada imagen
        const insertPromises = images.map((img) => {
            return db.query(
                `INSERT INTO ${schema}.product_img (id_product, url_img) VALUES ($1, $2) RETURNING *`,
                [productId, img.url]
            );
        });

        const results = await Promise.all(insertPromises);
        const insertedImages = results.map(result => result.rows[0]);
        res.status(200).json({ message: 'Imágenes guardadas en la base de datos', images: insertedImages });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

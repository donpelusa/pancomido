// api/src/routes/uploadRoute.js

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Endpoint para subir imágenes a Cloudinary
 *
 * /upload:
 *   post:
 *     summary: Subir imágenes de un producto a Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       description: Se requiere enviar un productId y hasta 4 archivos de imagen
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             example:
 *               productId: "1"
 *     responses:
 *       200:
 *         description: Imágenes subidas correctamente, retorna las URLs y public_ids.
 *       500:
 *         description: Error al subir imágenes.
 */

const express = require('express');
const multer = require('multer');
const cloudinary = require('../../cloudinaryConfig.js');

const router = express.Router();

// Configuración de multer en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { files: 4 } // Limita a 4 archivos por producto
});

router.post('/', upload.array('images', 4), async (req, res) => {
    try {
        const productId = req.body.productId; // Se espera que el front envíe productId
        const uploadResults = [];

        // Procesa cada archivo recibido
        for (const file of req.files) {
            // Convierte el buffer a una cadena en formato base64
            const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            // Sube a Cloudinary
            const result = await cloudinary.uploader.upload(fileStr, {
                folder: `productos/${productId}` // Organiza las imágenes por producto
            });

            // Guarda el resultado en un arreglo
            uploadResults.push({
                url: result.secure_url,
                public_id: result.public_id,
                productId
            });
        }

        // Retorna los resultados sin realizar inserción en la base de datos.
        res.status(200).json({ message: 'Imágenes subidas correctamente', images: uploadResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al subir imágenes', error: error.message });
    }
});

module.exports = router;

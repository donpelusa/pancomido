// src/routes/uploadRoute.js

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

// src/routes/uploadRoute.js
const express = require('express');
const multer = require('multer');
const { uploadImage, deleteImage } = require('../helpers/cloudinaryHelper');
const { validateToken } = require('../middlewares/validateToken');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Configuración de multer en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { files: 4 } // Limita a 4 archivos
});

// Endpoint para subir imágenes a Cloudinary, exclusivo para Admin
router.post('/', validateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha enviado ningún archivo." });
        }
        // req.file contiene buffer y mimetype
        const result = await uploadImage(req.file.buffer, req.file.mimetype, `productos/${req.body.productId || ''}`);
        // Devuelve la URL y el public_id para usar en la carga del producto
        res.status(200).json({ secure_url: result.secure_url, public_id: result.public_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al subir imagen", error: error.message });
    }
});

// Endpoint para eliminar una imagen de Cloudinary, exclusivo para Admin
router.delete('/', validateToken, isAdmin, async (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) {
            return res.status(400).json({ error: "Se requiere el public_id de la imagen a eliminar." });
        }
        const result = await deleteImage(public_id);
        res.status(200).json({ message: "Imagen eliminada", result });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar imagen", error: error.message });
    }
});

module.exports = router;


// backend/src/controllers/adminProducts.controller.js
const db = require('../config/db');
const Product = require('../models/Product');
const schema = process.env.DB_SCHEMA;
const cloudinary = require('../../cloudinaryConfig');

/**
 * Listar productos para admin.
 * Retorna cada producto con la imagen principal, stock, categorías y un arreglo "images"
 * con objetos { secure_url, public_id }.
 */
const getAdminProducts = async (req, res, next) => {
    try {
        const query = `
        SELECT 
          p.*,
          pi_main.url_img,
          (SELECT stock FROM ${schema}.stock WHERE id_product = p.id) AS stock,
          cat.categories,
          (
            SELECT array_agg(json_build_object('secure_url', url_img, 'public_id', cloudinary_public_id) ORDER BY id)
            FROM ${schema}.product_img
            WHERE id_product = p.id
          ) AS images
        FROM ${schema}.products p
        LEFT JOIN (
          SELECT DISTINCT ON (id_product) 
            id_product, 
            url_img
          FROM ${schema}.product_img
          ORDER BY id_product, id
        ) pi_main ON p.id = pi_main.id_product
        LEFT JOIN (
          SELECT 
            cp.id_product, 
            array_agg(c.category) AS categories
          FROM ${schema}.categories_products cp
          INNER JOIN ${schema}.categories c ON cp.id_category = c.id
          GROUP BY cp.id_product
        ) cat ON p.id = cat.id_product
        ORDER BY p.id;
      `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

/**
 * Crear un nuevo producto.
 * Se espera un body con:
 * {
 *   "product": "Pan Artesanal",
 *   "price": 250,
 *   "ingredients": "Harina, agua, levadura",
 *   "weight": 0.5,
 *   "description": "Descripción del producto",
 *   "nutrition": "Alto en fibra",
 *   "available": false,  // por defecto false
 *   "stock": 100,
 *   "categories": ["Categoría1", "Categoría2"],
 *   "images": [ ... ] // Opcional (para reenvío en edición)
 * }
 */
const createProduct = async (req, res, next) => {
    try {
        const { stock, categories, ...productData } = req.body;
        const newProduct = await Product.createProduct(productData);

        // Insertar stock inicial
        const initialStock = stock !== undefined ? stock : 0;
        const stockRecord = await Product.createStock(newProduct.id, initialStock);
        newProduct.stock = stockRecord.stock;

        // Insertar categorías (si se proporcionan)
        if (Array.isArray(categories)) {
            for (const catName of categories) {
                const catSelectQuery = `SELECT id FROM ${schema}.categories WHERE category = $1`;
                const catSelectResult = await db.query(catSelectQuery, [catName]);
                let catId;
                if (catSelectResult.rows.length > 0) {
                    catId = catSelectResult.rows[0].id;
                } else {
                    const catInsertQuery = `
            INSERT INTO ${schema}.categories (category)
            VALUES ($1) RETURNING id
          `;
                    const catInsertResult = await db.query(catInsertQuery, [catName]);
                    catId = catInsertResult.rows[0].id;
                }
                const cpInsertQuery = `
          INSERT INTO ${schema}.categories_products (id_product, id_category)
          VALUES ($1, $2)
        `;
                await db.query(cpInsertQuery, [newProduct.id, catId]);
            }
        }

        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

/**
 * Actualizar datos del producto, incluyendo categorías y las imágenes.
 * Se espera en el body: product, price, ingredients, weight, description, nutrition, available, categories, images.
 */
const updateProductDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        product,
        price,
        ingredients,
        weight,
        description,
        nutrition,
        available,
        categories,
        images // Se espera que, en el caso de edición, este arreglo sea enviado únicamente si hubo cambios
      } = req.body;
  
      // Actualizar datos básicos del producto
      const updateQuery = `
        UPDATE ${schema}.products
        SET product = $1,
            price = $2,
            ingredients = $3,
            weight = $4,
            description = $5,
            nutrition = $6,
            available = $7,
            updated_at = NOW()
        WHERE id = $8
        RETURNING *
      `;
      const updateValues = [product, price, ingredients, weight, description, nutrition, available, id];
      const { rows } = await db.query(updateQuery, updateValues);
      const updatedProduct = rows[0];
  
      // Actualizar categorías
      await db.query(`DELETE FROM ${schema}.categories_products WHERE id_product = $1`, [id]);
      if (Array.isArray(categories)) {
        for (const catName of categories) {
          const catSelectResult = await db.query(`SELECT id FROM ${schema}.categories WHERE category = $1`, [catName]);
          let catId;
          if (catSelectResult.rows.length > 0) {
            catId = catSelectResult.rows[0].id;
          } else {
            const catInsertResult = await db.query(
              `INSERT INTO ${schema}.categories (category) VALUES ($1) RETURNING id`,
              [catName]
            );
            catId = catInsertResult.rows[0].id;
          }
          await db.query(
            `INSERT INTO ${schema}.categories_products (id_product, id_category) VALUES ($1, $2)`,
            [id, catId]
          );
        }
      }
  
      // Actualizar imágenes solo si el payload incluye la propiedad "images"
      if (req.body.hasOwnProperty('images')) {
        // 1. Obtener las imágenes actuales de la BD para este producto
        const currentImagesResult = await db.query(
          `SELECT * FROM ${schema}.product_img WHERE id_product = $1`,
          [id]
        );
        const currentImages = currentImagesResult.rows;
        const currentPublicIds = currentImages.map(img => img.cloudinary_public_id);
  
        // 2. Procesar el arreglo enviado en el payload
        // Se espera que cada objeto en "images" tenga al menos:
        //   - secure_url (o url)
        //   - public_id
        const newImages = images; // Arreglo de imágenes enviado por el frontend
        const newPublicIds = newImages.map(img => img.public_id).filter(pid => pid);
  
        // 3. Eliminar las imágenes que ya no estén en el payload
        const imagesToDelete = currentImages.filter(
          img => !newPublicIds.includes(img.cloudinary_public_id)
        );
        for (const img of imagesToDelete) {
          try {
            await cloudinary.uploader.destroy(img.cloudinary_public_id);
          } catch (error) {
            console.error(`Error deleting image ${img.cloudinary_public_id}:`, error);
            // Se puede decidir reintentar o continuar según la política de errores
          }
          await db.query(`DELETE FROM ${schema}.product_img WHERE id = $1`, [img.id]);
        }
  
        // 4. Insertar las nuevas imágenes (aquellas que estén en el payload pero no en la BD)
        const imagesToInsert = newImages.filter(
          img => !currentPublicIds.includes(img.public_id)
        );
        for (const img of imagesToInsert) {
          // Solo insertar si se tiene tanto la URL como el public_id
          if (img.secure_url && img.public_id) {
            const insertImgQuery = `
              INSERT INTO ${schema}.product_img (id_product, url_img, cloudinary_public_id)
              VALUES ($1, $2, $3)
            `;
            await db.query(insertImgQuery, [id, img.secure_url, img.public_id]);
          }
        }
      }
      
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  };
  

/**
 * Actualizar stock de un producto.
 */
const updateStock = async (req, res, next) => {
    try {
        const { id } = req.params; // id del producto
        const { stock } = req.body;
        const query = `
      UPDATE ${schema}.stock
      SET stock = $1,
          updated_at = NOW()
      WHERE id_product = $2
      RETURNING *
    `;
        const { rows } = await db.query(query, [stock, id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en stock' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

/**
 * Eliminar productos múltiples y borrar categorías huérfanas.
 * Además, elimina las imágenes asociadas en Cloudinary usando cloudinary_public_id
 * y su carpeta contenedora con el id de producto.
 */
const deleteMultipleProducts = async (req, res, next) => {
    try {
        const { productIds } = req.body;
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ error: 'Se requiere un arreglo de productIds' });
        }

        // Para cada producto a eliminar, obtener las imágenes y borrarlas de Cloudinary
        for (const productId of productIds) {
            const imageQuery = `SELECT * FROM ${schema}.product_img WHERE id_product = $1`;
            const { rows: imageRows } = await db.query(imageQuery, [productId]);
            for (const img of imageRows) {
                try {
                    await cloudinary.uploader.destroy(img.cloudinary_public_id);
                } catch (cloudErr) {
                    console.error(`Error eliminando imagen ${img.cloudinary_public_id} en Cloudinary:`, cloudErr);
                    // Se continúa con la eliminación de las demás imágenes
                }
            }
            // Intentar eliminar la carpeta asociada al producto
            try {
                await cloudinary.api.delete_folder(`productos/${productId}`);
            } catch (folderErr) {
                console.error(`Error eliminando carpeta products/${productId}:`, folderErr);
                // Nota: Si la carpeta no está vacía o no existe, se mostrará un error; puedes decidir si abortar o continuar.
            }
        }

        // Eliminar registros de imágenes en la BD
        const deleteImagesQuery = `
        DELETE FROM ${schema}.product_img
        WHERE id_product = ANY($1::int[])
      `;
        await db.query(deleteImagesQuery, [productIds]);

        // Eliminar los productos
        const deleteProductsQuery = `
        DELETE FROM ${schema}.products
        WHERE id = ANY($1::int[])
        RETURNING *
      `;
        const { rows } = await db.query(deleteProductsQuery, [productIds]);

        // Eliminar categorías huérfanas
        const orphanQuery = `
        DELETE FROM ${schema}.categories
        WHERE id NOT IN (SELECT DISTINCT id_category FROM ${schema}.categories_products)
        RETURNING *
      `;
        await db.query(orphanQuery);

        res.json({ message: 'Productos eliminados', products: rows });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAdminProducts,
    createProduct,
    updateProductDetails,
    updateStock,
    deleteMultipleProducts,
};

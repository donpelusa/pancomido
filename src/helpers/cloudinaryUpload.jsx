// backend/src/helpers/cloudinaryHelper.js
const cloudinary = require("../../cloudinaryConfig"); // Ajusta la ruta si es necesario

/**
 * Sube un archivo a Cloudinary.
 * @param {Buffer} fileBuffer - El buffer del archivo.
 * @param {string} mimetype - El tipo MIME del archivo.
 * @param {string} folder - (Opcional) Carpeta destino en Cloudinary.
 * @returns {Promise<Object>} - Resultado de la subida (incluye secure_url y public_id).
 */
const uploadImage = (fileBuffer, mimetype, folder = "productos") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Elimina una imagen de Cloudinary.
 * @param {string} publicId - El public_id de la imagen a eliminar.
 * @returns {Promise<Object>} - Resultado de la eliminación.
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadImage, deleteImage };

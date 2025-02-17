// src/hooks/useProductImages.js
import { useState, useRef } from "react";
import { showUniqueToast } from "../helpers/showUniqueToast.helper";

export const useProductImages = (API_URL, session, editingProductId) => {
  // Estado para las imágenes: 4 slots (null, File o { secure_url, public_id })
  const [productImages, setProductImages] = useState([null, null, null, null]);

  // Refs para los inputs file (4 slots)
  const fileInputsRef = useRef([]);
  if (fileInputsRef.current.length !== 4) {
    fileInputsRef.current = Array(4)
      .fill(null)
      .map((_, i) => fileInputsRef.current[i] || { current: null });
  }

  // Forzar el click en el input file del slot indicado
  const handleFileSelect = (slotIndex) => {
    if (
      fileInputsRef.current[slotIndex] &&
      fileInputsRef.current[slotIndex].current
    ) {
      fileInputsRef.current[slotIndex].current.click();
    }
  };

  // Función para subir un archivo a Cloudinary
  const handleUploadFile = async (file, slotIndex, productId) => {
    try {
      const formDataObj = new FormData();
      formDataObj.append("image", file);
      formDataObj.append("productId", productId);
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        body: formDataObj,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al subir imagen");
      }
      setProductImages((prev) => {
        const newArr = [...prev];
        newArr[slotIndex] = {
          secure_url: data.secure_url,
          public_id: data.public_id,
        };
        return newArr;
      });
      showUniqueToast.success("Imagen cargada", { position: "bottom-right" });
    } catch (error) {
      showUniqueToast.error(error.message, { position: "bottom-right" });
    }
  };

  // Función para manejar el cambio de archivo en un input del slot indicado
  const handleFileChange = (e, slotIndex) => {
    const file = e.target.files[0];
    if (file) {
      if (editingProductId) {
        // Si se está editando, sube inmediatamente usando el ID del producto
        handleUploadFile(file, slotIndex, editingProductId);
      } else {
        // Para nuevo producto, solo se guarda el objeto File para subirlo luego
        setProductImages((prev) => {
          const newArr = [...prev];
          newArr[slotIndex] = file;
          return newArr;
        });
        showUniqueToast.info("Imagen seleccionada. Se subirá al guardar el producto.", {
          position: "bottom-right",
        });
      }
    }
  };

  // Función para eliminar la imagen en el slot indicado
  const handleDeleteImage = async (slotIndex) => {
    const image = productImages[slotIndex];
    if (!image) return;
    if (image.public_id) {
      try {
        const response = await fetch(`${API_URL}/api/upload`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ public_id: image.public_id }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Error al eliminar imagen");
        }
        showUniqueToast.success("Imagen eliminada", { position: "bottom-right" });
      } catch (error) {
        showUniqueToast.error(error.message, { position: "bottom-right" });
      }
    }
    setProductImages((prev) => {
      const newArr = [...prev];
      newArr[slotIndex] = null;
      return newArr;
    });
  };

  return {
    productImages,
    setProductImages,
    fileInputsRef,
    handleFileSelect,
    handleFileChange,
    handleDeleteImage,
  };
};

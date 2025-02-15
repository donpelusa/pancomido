// frontend/src/hooks/useFavorites.jsx
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      // Se espera que el endpoint de favoritos devuelva [{ id: productId }, ...]
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener favoritos");
      const favData = await res.json();
      // console.log("FavData recibido:", favData);

      // Para cada favorito, obtenemos los detalles completos del producto
      const detailedFavorites = await Promise.all(
        favData.map(async (fav) => {
          try {
            const resProd = await fetch(
              `${import.meta.env.VITE_API_URL}/api/products/${fav.id}`,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!resProd.ok) {
              console.error(
                "Error al obtener detalles para producto ID",
                fav.id
              );
              return null;
            }
            const prod = await resProd.json();
            // console.log("Detalles del producto (ID:", fav.id, "):", prod);
            // Se espera que prod.images sea un arreglo; la imagen principal es la posición 0
            const images = prod.images || [];
            if (images.length > 0) {
              // console.log(
              //   "Imagen principal para ID",
              //   prod.id,
              //   ":",
              //   images[0].secure_url || images[0].url || images[0].url_img
              // );
            } else {
              console.warn(
                "No se encontraron imágenes para producto ID",
                prod.id
              );
            }
            return {
              id: prod.id,
              product: prod.product,
              price: prod.price,
              images, // Retornamos el arreglo completo
            };
          } catch (err) {
            console.error("Error en el fetch de producto", fav.id, err);
            return null;
          }
        })
      );
      setFavorites(detailedFavorites.filter((item) => item !== null));
      setLoading(false);
    } catch (err) {
      console.error("Error en fetchFavorites:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [session]);

  const addFavorite = async (productId) => {
    if (!session?.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Error al agregar a favoritos");
      await fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavorite = async (productId) => {
    if (!session?.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Error al eliminar de favoritos");
      await fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (productId) => {
    const exists = favorites.some((fav) => fav.id === productId);
    if (exists) {
      await removeFavorite(productId);
    } else {
      await addFavorite(productId);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    fetchFavorites,
    loading,
  };
};

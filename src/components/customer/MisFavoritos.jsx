// frontend/src/components/customer/MisFavoritos.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import { Spin } from "antd";
import { useFavorites } from "../../hooks/useFavorites";

export const MisFavoritos = () => {
  const { favorites, toggleFavorite, removeFavorite, fetchFavorites, loading } =
    useFavorites();
  const [selectedFavorites, setSelectedFavorites] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFavorites(favorites.map((fav) => fav.id));
    } else {
      setSelectedFavorites([]);
    }
  };

  const handleSelectFavorite = (id, checked) => {
    if (checked) {
      setSelectedFavorites((prev) => [...prev, id]);
    } else {
      setSelectedFavorites((prev) => prev.filter((favId) => favId !== id));
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedFavorites.length === 0) return;
    try {
      await Promise.all(selectedFavorites.map((id) => removeFavorite(id)));
      toast.success("Favoritos eliminados");
      setSelectedFavorites([]);
      await fetchFavorites();
    } catch (error) {
      toast.error("Error eliminando favoritos");
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin tip="Cargando favoritos...">
            <div style={{ width: "350px", height: "150px" }} />
          </Spin>
        </div>
      ) : (
        <>
          {favorites.length === 0 ? (
            <p>No tienes productos favoritos.</p>
          ) : (
            <>
              {/* Controles globales */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      favorites.length > 0 &&
                      selectedFavorites.length === favorites.length
                    }
                    onChange={handleSelectAll}
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Seleccionar todo</span>
                </div>
                <button
                  onClick={handleRemoveSelected}
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                >
                  Quitar seleccionados de favoritos
                </button>
              </div>
              {/* Grilla de Favoritos: 5 columnas */}
              <div className="grid grid-cols-5 gap-4">
                {favorites.map((item) => {
                  const isSelected = selectedFavorites.includes(item.id);
                  // Extraer la imagen principal del arreglo: posición 0
                  const mainImage =
                    item.images && item.images.length > 0
                      ? typeof item.images[0] === "string"
                        ? item.images[0]
                        : item.images[0].secure_url ||
                          item.images[0].url ||
                          item.images[0].url_img ||
                          ""
                      : "";
                  return (
                    <div
                      key={item.id}
                      className="relative border rounded overflow-hidden group aspect-square"
                    >
                      {/* Checkbox en la esquina superior izquierda */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectFavorite(item.id, e.target.checked);
                        }}
                        className="absolute top-2 left-2 z-20 w-5 h-5"
                      />
                      {/* Ícono de corazón en la esquina superior derecha */}
                      <div
                        className="absolute top-2 right-2 z-20 cursor-pointer transition-transform group-active:scale-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                      >
                        <FaHeart size={24} className="text-red-500" />
                      </div>
                      {/* Tarjeta de imagen */}
                      <div className="w-full h-full">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={item.product}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      {/* Contenedor semitransparente con el nombre del producto */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                        <p className="text-white text-center text-s truncate">
                          {item.product}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MisFavoritos;

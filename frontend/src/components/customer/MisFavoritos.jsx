import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const MisFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    // Simula la carga de favoritos. En un caso real, obtendrías estos datos de una API o del estado global.
    setFavoritos([
      { id: 101, title: "Producto Favorito 1", image: "/ruta/a/imagen1.jpg" },
      { id: 102, title: "Producto Favorito 2", image: "/ruta/a/imagen2.jpg" },
    ]);
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Mis Favoritos</h3>
      {favoritos.length === 0 ? (
        <p>No tienes productos favoritos.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favoritos.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="border p-2 rounded-md flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover mb-2"
              />
              <p className="text-center">{item.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

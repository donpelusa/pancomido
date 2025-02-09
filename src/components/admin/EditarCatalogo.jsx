// src/components/admin/EditarCatalogo.jsx

import { useEffect, useState } from "react";

export const EditarCatalogo = () => {
  const [catalogo, setCatalogo] = useState([]);

  useEffect(() => {
    // Simula la carga del catálogo
    setTimeout(() => {
      setCatalogo([
        { id: 1, name: "Producto 1" },
        { id: 2, name: "Producto 2" },
        { id: 3, name: "Producto 3" },
      ]);
    }, 1000);
  }, []);

  if (catalogo.length === 0) return <p>Cargando catálogo...</p>;

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Editar Catálogo</h3>
      <ul className="space-y-2">
        {catalogo.map((producto) => (
          <li
            key={producto.id}
            className="flex justify-between items-center border p-2 rounded-md"
          >
            <span>{producto.name}</span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

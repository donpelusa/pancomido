import { useEffect, useState } from "react";

export const MisDirecciones = () => {
  const [direcciones, setDirecciones] = useState([]);

  useEffect(() => {
    // Simula la carga de direcciones. En un caso real, obtendrías estos datos de una API o estado global.
    setDirecciones([
      { id: 1, direccion: "Calle Falsa 123, Ciudad, País" },
      { id: 2, direccion: "Avenida Siempre Viva 742, Ciudad, País" },
    ]);
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Mis Direcciones</h3>
      {direcciones.length === 0 ? (
        <p>No tienes direcciones registradas.</p>
      ) : (
        <ul className="space-y-2">
          {direcciones.map((dir) => (
            <li
              key={dir.id}
              className="border p-2 rounded-md flex justify-between items-center"
            >
              <span>{dir.direccion}</span>
              <button className="text-blue-600 hover:underline">Editar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

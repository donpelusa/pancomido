import React, { useEffect, useState } from "react";

export const EditarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Simula la carga de usuarios
    setTimeout(() => {
      setUsuarios([
        { id: 1, username: "admin", role: "admin" },
        { id: 2, username: "usuario1", role: "customer" },
        { id: 3, username: "usuario2", role: "customer" },
      ]);
    }, 1000);
  }, []);

  if (usuarios.length === 0) return <p>Cargando usuarios...</p>;

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Editar Usuarios</h3>
      <ul className="space-y-2">
        {usuarios.map((usuario) => (
          <li
            key={usuario.id}
            className="flex justify-between items-center border p-2 rounded-md"
          >
            <span>
              {usuario.username} - {usuario.role}
            </span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

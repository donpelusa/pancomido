import { useEffect, useState } from "react";

export const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Aquí simulas la carga de pedidos. En un caso real, llamarías a una API.
    setPedidos([
      { id: 1, fecha: "2025-01-15", estado: "Enviado" },
      { id: 2, fecha: "2025-02-03", estado: "En proceso" },
      { id: 3, fecha: "2025-02-10", estado: "Entregado" },
    ]);
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Mis Pedidos</h3>
      {pedidos.length === 0 ? (
        <p>No has realizado pedidos aún.</p>
      ) : (
        <ul className="space-y-2">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="border p-2 rounded-md">
              <p>Pedido #{pedido.id}</p>
              <p>Fecha: {pedido.fecha}</p>
              <p>Estado: {pedido.estado}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

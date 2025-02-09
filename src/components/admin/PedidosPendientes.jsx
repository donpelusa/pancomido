// src/components/admin/PedidosPendientes.jsx

import { useEffect, useState } from "react";

export const PedidosPendientes = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Simula la carga de pedidos pendientes
    setTimeout(() => {
      setPedidos([
        { id: 101, customer: "Cliente 1", total: 150, status: "Pendiente" },
        { id: 102, customer: "Cliente 2", total: 200, status: "Pendiente" },
      ]);
    }, 1000);
  }, []);

  if (pedidos.length === 0) return <p>No hay pedidos pendientes.</p>;

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Pedidos Pendientes</h3>
      <ul className="space-y-2">
        {pedidos.map((pedido) => (
          <li key={pedido.id} className="border p-2 rounded-md">
            <p>
              <strong>Pedido #{pedido.id}</strong>
            </p>
            <p>Cliente: {pedido.customer}</p>
            <p>Total: ${pedido.total}</p>
            <p>Status: {pedido.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

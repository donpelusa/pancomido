// src/components/admin/PedidosHistoricos.jsx

import { useEffect, useState } from "react";

export const PedidosHistoricos = () => {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    // Simula la carga del historial de pedidos
    setTimeout(() => {
      setHistorico([
        { id: 201, customer: "Cliente 3", total: 250, status: "Entregado" },
        { id: 202, customer: "Cliente 4", total: 300, status: "Entregado" },
      ]);
    }, 1000);
  }, []);

  if (historico.length === 0) return <p>No hay historial de pedidos.</p>;

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Pedidos Históricos</h3>
      <ul className="space-y-2">
        {historico.map((pedido) => (
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

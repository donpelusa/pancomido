import { useEffect, useState } from "react";

export const ResumenTienda = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simula la carga de datos. En un caso real, realiza una llamada a la API.
    setTimeout(() => {
      setData({
        ventas: 12000,
        productos: 150,
        pedidos: 75,
      });
    }, 1000);
  }, []);

  if (!data) return <p>Cargando resumen de la tienda...</p>;

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Resumen General de la Tienda</h3>
      <div className="space-y-2">
        <p>
          <strong>Ventas Totales:</strong> ${data.ventas}
        </p>
        <p>
          <strong>Número de Productos:</strong> {data.productos}
        </p>
        <p>
          <strong>Total de Pedidos:</strong> {data.pedidos}
        </p>
      </div>
    </div>
  );
};

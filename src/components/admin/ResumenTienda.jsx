// frontend/src/components/admin/ResumenTienda.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card, Spin, List, Typography } from "antd";
import { showUniqueToast } from "../../helpers/showUniqueToast.helper";
import { formatCLP } from "../../helpers/formatPrice.helper";
import statusOptions from "../../data/statusOptions.json";

const { Title, Text } = Typography;

export const ResumenTienda = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Obtenemos la sesión (asegúrate de que el usuario tenga rol admin)
  const { session } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/dashboard/summary`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        });
        if (!res.ok) throw new Error("Error cargando resumen tienda");
        const data = await res.json();
        setSummary(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        showUniqueToast.error(error.message, { position: "bottom-right" });
        setLoading(false);
      }
    };
    fetchSummary();
  }, [API_URL, session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin tip="Cargando resumen tienda...">
          <div style={{ width: "350px", height: "150px" }} />
        </Spin>
      </div>
    );
  }

  if (!summary) return null;

  const summaryData = [
    {
      label: "Total ventas del mes",
      value: `${formatCLP(summary.monthly_sales)}`,
    },
    { label: "Pedidos del mes", value: summary.monthly_orders },
    {
      label: "Total productos disponibles",
      value: summary.total_available_products,
    },
    { label: "Stock total de productos", value: summary.total_stock },
    { label: "Usuarios registrados", value: summary.registered_users },
    { label: "Usuarios habilitados", value: summary.enabled_users },
    { label: "Top 3 Favoritos", value: summary.top_favorites || "-" },
    {
      label: "Productos sin stock",
      value: summary.out_of_stock_products || "-",
    },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-8">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="border p-2 rounded flex flex-col items-center"
          >
            <Text strong>{item.label}</Text>
            <Text className="mt-2">{item.value}</Text>
          </div>
        ))}
      </div>
      <Title level={4}>Últimos 3 pedidos creados</Title>
      {summary.latest_orders && summary.latest_orders.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={summary.latest_orders}
          renderItem={(order) => (
            <List.Item>
              <List.Item.Meta
                title={`Pedido #${order.id} - Total: $${formatCLP(
                  order.total
                )}`}
                description={`Fecha: ${new Date(
                  order.created_at
                ).toLocaleDateString()} | Entrega programada: ${new Date(
                  order.order_delivery_date
                ).toLocaleDateString()} | Estado: ${
                  statusOptions.find(
                    (opt) => opt.key === String(order.order_status_id)
                  )?.label || "Desconocido"
                }`}
              />
            </List.Item>
          )}
        />
      ) : (
        <Text>No hay pedidos recientes.</Text>
      )}
    </div>
  );
};

export default ResumenTienda;

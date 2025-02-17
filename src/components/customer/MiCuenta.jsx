// frontend/src/components/customer/MiCuenta.jsx

import { useState, useEffect } from "react";
import { Card, Typography, Spin, List } from "antd";
import { showUniqueToast } from "../../helpers/showUniqueToast.helper";
import { useAuth } from "../../hooks/useAuth";
import statusOptions from "../../data/statusOptions.json";

const { Title, Text } = Typography;

export const MiCuenta = () => {
  const { session } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [mainAddress, setMainAddress] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const statusMap = statusOptions.reduce((map, option) => {
    map[option.key] = option.label;
    return map;
  }, {});

  // Cargar datos del usuario
  useEffect(() => {
    if (session?.token) {
      setLoadingProfile(true);
      fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar el perfil");
          return res.json();
        })
        .then((data) => {
          setUserData(data.user);
          setLoadingProfile(false);
        })
        .catch((err) => {
          console.error(err);
          showUniqueToast.error(err.message, { position: "bottom-right" });
          setLoadingProfile(false);
        });
    }
  }, [session]);

  // Cargar la dirección principal del usuario
  useEffect(() => {
    if (session?.token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const principal =
            data.find((addr) => addr.main) ||
            (data.length > 0 ? data[0] : null);
          setMainAddress(principal);
        })
        .catch((err) => {
          console.error(err);
          showUniqueToast.error("Error al cargar direcciones", {
            position: "bottom-right",
          });
        });
    }
  }, [session]);

  // Cargar compras recientes (pedidos) del usuario
  useEffect(() => {
    if (session?.token) {
      setLoadingOrders(true);
      fetch(`${import.meta.env.VITE_API_URL}/api/orders/detailed`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar pedidos");
          return res.json();
        })
        .then((data) => {
          // Ordenar de forma descendente según la fecha de compra
          const sorted = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          // Filtrar pedidos para que no muestre los finalizados (status 7)
          const filtrados = sorted.filter(
            (order) => order.order_status_id !== 7
          );
          // Tomar los 3 pedidos más recientes (ajustable)
          setRecentOrders(filtrados.slice(0, 3));
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error(err);
          showUniqueToast.error(err.message, { position: "bottom-right" });
          setLoadingOrders(false);
        });
    }
  }, [session]);

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center">
        <Spin tip="Cargando los datos del usuario...">
          <div style={{ width: "350px", height: "150px" }} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card className="py-2">
        <Title level={3}>
          Bienvenido, {userData?.name ? userData.name : "Usuario"}
        </Title>
        <p>
          <strong>Rut:</strong>{" "}
          {userData?.rut ? (
            userData.rut
          ) : (
            <Text type="danger">No Registrado</Text>
          )}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {userData?.mail ? (
            userData.mail
          ) : (
            <Text type="danger">No Registrado</Text>
          )}
        </p>
        <p>
          <strong>Dirección:</strong>{" "}
          {mainAddress ? (
            `${mainAddress.address}, ${mainAddress.city}, ${mainAddress.province}, ${mainAddress.region}`
          ) : (
            <Text type="danger">No Registrado</Text>
          )}
        </p>
        <p>
          <strong>Teléfono:</strong>{" "}
          {userData?.phone ? (
            userData.phone
          ) : (
            <Text type="danger">No Registrado</Text>
          )}
        </p>
      </Card>
      <Card title="Compras recientes" className="py-2">
        {loadingOrders ? (
          <div className="flex justify-center items-center">
            <Spin tip="Cargando compras recientes...">
              <div style={{ width: "350px", height: "150px" }} />
            </Spin>
          </div>
        ) : recentOrders.length === 0 ? (
          <p>No tienes compras recientes.</p>
        ) : (
          <List
            dataSource={recentOrders}
            renderItem={(order) => (
              <List.Item>
                <p>
                  <strong>Orden #{order.id}</strong> - Estado:{" "}
                  {order.status
                    ? order.status
                    : statusMap[order.order_status_id] || "Desconocido"}
                </p>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

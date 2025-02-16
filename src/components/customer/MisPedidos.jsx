// frontend/src/components/customer/MisPedidos.jsx

import { useState, useEffect } from "react";
import { List, Modal, Button, Table, Spin } from "antd";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { formatCLP } from "../../helpers/formatPrice.helper";
import statusOptions from "../../data/statusOptions.json";

export const MisPedidos = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Estado para almacenar detalles de productos (por productId)
  const [productDetails, setProductDetails] = useState({});

  const statusMap = statusOptions.reduce((map, option) => {
    map[option.key] = option.label;
    return map;
  }, {});

  // Función para formatear fechas en DD-MM-YYYY
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Función para obtener la imagen principal del producto
  const getMainImage = (product) => {
    const images = product.images ? product.images : [];
    if (images && images.length > 0) {
      return typeof images[0] === "string"
        ? images[0]
        : images[0].secure_url || images[0].url || images[0].url_img || "";
    }
    return "";
  };

  // Cargar pedidos detallados desde el backend
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
          if (!res.ok) throw new Error("Error al cargar los pedidos");
          return res.json();
        })
        .then((data) => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message, { position: "bottom-right" });
          setLoadingOrders(false);
        });
    }
  }, [session]);

  // Cuando se selecciona un pedido, cargar detalles de cada producto que no tengamos
  useEffect(() => {
    if (selectedOrder && selectedOrder.products) {
      const idsToFetch = selectedOrder.products
        .map((prod) => prod.productId)
        .filter((id) => !productDetails[id]);
      if (idsToFetch.length > 0) {
        Promise.all(
          idsToFetch.map((id) =>
            fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
              headers: { "Content-Type": "application/json" },
            }).then((res) => res.json())
          )
        )
          .then((results) => {
            const newDetails = {};
            results.forEach((detail) => {
              newDetails[detail.id] = detail;
            });
            setProductDetails((prev) => ({ ...prev, ...newDetails }));
          })
          .catch((err) => {
            console.error("Error fetching product details:", err);
          });
      }
    }
  }, [selectedOrder, productDetails]);

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  // Función para renderizar la tabla con los productos del pedido
  const renderOrderProducts = () => {
    if (!selectedOrder || !selectedOrder.products) return null;
    return (
      <Table
        dataSource={selectedOrder.products}
        pagination={false}
        rowKey="productId"
        columns={[
          {
            title: "Imagen",
            dataIndex: "productId",
            key: "imagen",
            align: "center",
            render: (productId, record) => {
              const detail = productDetails[productId];
              const mainImage = detail ? getMainImage(detail) : "";
              return mainImage ? (
                <img
                  src={mainImage}
                  alt={record.product}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    margin: "0 auto",
                  }}
                >
                  Sin imagen
                </div>
              );
            },
          },
          {
            title: "Producto",
            dataIndex: "product",
            key: "producto",
            align: "center",
          },
          {
            title: "Precio (x un)",
            dataIndex: "unit_price",
            key: "precio",
            align: "center",
            render: (price) => formatCLP(Number(price)),
          },
          {
            title: "Cantidad",
            dataIndex: "units",
            key: "cantidad",
            align: "center",
          },
          {
            title: "Subtotal",
            key: "subtotal",
            align: "center",
            render: (text, record) =>
              formatCLP(Number(record.unit_price) * record.units),
          },
        ]}
      />
    );
  };

  if (loadingOrders) {
    return (
      <div className="flex justify-center items-center">
        <Spin tip="Cargando pedidos...">
          <div style={{ width: "350px", height: "150px" }} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="p-4">
      {orders.length === 0 ? (
        <p>No has realizado pedidos aún.</p>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={orders}
          renderItem={(order) => (
            <List.Item
              onClick={() => showOrderDetails(order)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                title={`Pedido #${order.id}`}
                description={
                  <>
                    <p>
                      <strong>Fecha de compra:</strong>{" "}
                      {formatDate(order.created_at)}
                    </p>
                    <p>
                      <strong>Entrega programada:</strong>{" "}
                      {formatDate(order.order_delivery_date)}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {order.status
                        ? order.status
                        : statusMap[order.order_status_id] || "Desconocido"}
                    </p>
                  </>
                }
              />
              <p>
                <strong>Total:</strong>{" "}
                {formatCLP(Number(order.total_purchase))}
              </p>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={`Detalles del Pedido #${selectedOrder ? selectedOrder.id : ""}`}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            {renderOrderProducts()}
            <div className="mt-4 border-t pt-4" style={{ textAlign: "center" }}>
              <p>
                <strong>Total de la compra:</strong>{" "}
                {formatCLP(Number(selectedOrder.total_purchase))}
              </p>
              <p>
                <strong>Fecha de compra:</strong>{" "}
                {formatDate(selectedOrder.created_at)}
              </p>
              <p>
                <strong>Entrega programada:</strong>{" "}
                {formatDate(selectedOrder.order_delivery_date)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedOrder.status
                  ? selectedOrder.status
                  : statusMap[selectedOrder.order_status_id] || "Desconocido"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

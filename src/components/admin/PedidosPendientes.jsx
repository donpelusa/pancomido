// frontend/src/components/admin/PedidosPendientes.jsx

import { useState, useEffect } from "react";
import { Checkbox, Button, Dropdown, List, Modal, Table, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { formatCLP } from "../../helpers/formatPrice.helper";
// Importamos las opciones de estado desde JSON
import statusOptions from "../../data/statusOptions.json";

export const PedidosPendientes = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [userModalVisible, setUserModalVisible] = useState(false);

  // Creamos el statusMap a partir del JSON
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

  // Refrescar la lista de pedidos pendientes desde el endpoint de admin
  const fetchOrders = () => {
    if (session?.token) {
      setLoadingOrders(true);
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/pending`, {
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
          // Filtrar los pedidos que NO sean finalizados (order_status_id distinto de 7)
          const pendientes = data.filter(
            (order) => order.order_status_id !== 7
          );
          // Ordenar de forma descendente por ID
          pendientes.sort((a, b) => b.id - a.id);
          setOrders(pendientes);
          setSelectedOrderIds([]);
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message, { position: "bottom-right" });
          setLoadingOrders(false);
        });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  // Función para actualizar el estado de una orden individual
  const updateOrderStatus = (orderId, newStatus) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ order_status_id: newStatus }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar el estado");
        return res.json();
      })
      .then(() => {
        toast.success(
          `Pedido #${orderId} actualizado a "${statusMap[String(newStatus)]}"`,
          { position: "bottom-right" }
        );
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message, { position: "bottom-right" });
      });
  };

  // Función para confirmar el bulk update con modal de confirmación
  const confirmBulkUpdate = ({ key }) => {
    const statusLabel = statusOptions.find((opt) => opt.key === key)?.label;
    Modal.confirm({
      title: "Confirmar cambio de estado",
      content: `¿Estás seguro de cambiar ${selectedOrderIds.length} pedidos a estado "${statusLabel}"?`,
      okText: "Confirmar",
      cancelText: "Cancelar",
      onOk: () => handleBulkUpdate({ key }),
    });
  };

  // Actualización bulk de estados
  const handleBulkUpdate = ({ key }) => {
    const newStatus = Number(key);
    Promise.all(
      selectedOrderIds.map((orderId) =>
        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify({ order_status_id: newStatus }),
          }
        )
      )
    )
      .then((responses) => {
        const allOk = responses.every((res) => res.ok);
        if (!allOk) throw new Error("Error en la actualización bulk");
        toast.success("Estados actualizados", { position: "bottom-right" });
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message, { position: "bottom-right" });
      });
  };

  // Herramientas de selección
  const handleSelectAll = (e) => {
    if (orders.length === 0) {
      setSelectedOrderIds([]);
    } else if (e.target.checked) {
      setSelectedOrderIds(orders.map((order) => order.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  // Estado para almacenar detalles de producto (por productId)
  const [productDetails, setProductDetails] = useState({});
  // Función para obtener la imagen principal de un producto dado su productId
  const getProductMainImage = (productId) => {
    const detail = productDetails[productId];
    if (detail && detail.images && detail.images.length > 0) {
      return typeof detail.images[0] === "string"
        ? detail.images[0]
        : detail.images[0].secure_url ||
            detail.images[0].url ||
            detail.images[0].url_img ||
            "";
    }
    return "";
  };

  // Cuando se abre el modal de pedido, cargar detalle de cada producto que no esté en caché
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

  // Modal para ver datos del usuario
  const renderUserModal = () => {
    if (!selectedOrder) return null;
    return (
      <Modal
        title="Datos del Usuario"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>
            Cerrar
          </Button>,
        ]}
      >
        <p>
          <strong>Nombre:</strong>{" "}
          {selectedOrder.customer ? (
            selectedOrder.customer
          ) : (
            <span style={{ color: "red" }}>No Registrado</span>
          )}
        </p>
        <p>
          <strong>RUT:</strong>{" "}
          {selectedOrder.rut ? (
            selectedOrder.rut
          ) : (
            <span style={{ color: "red" }}>No Registrado</span>
          )}
        </p>
        <p>
          <strong>Dirección de compra:</strong>{" "}
          {selectedOrder.order_address &&
          selectedOrder.order_city &&
          selectedOrder.order_region ? (
            `${selectedOrder.order_address}, ${selectedOrder.order_city}, ${selectedOrder.order_region}` +
            (selectedOrder.order_postal_code
              ? `, ${selectedOrder.order_postal_code}`
              : "")
          ) : (
            <span style={{ color: "red" }}>No Registrado</span>
          )}
        </p>
        <p>
          <strong>Teléfono:</strong>{" "}
          {selectedOrder.order_phone ? (
            selectedOrder.order_phone
          ) : (
            <span style={{ color: "red" }}>No Registrado</span>
          )}
        </p>
      </Modal>
    );
  };

  // Función para renderizar la tabla de productos del pedido
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
              const mainImage = getProductMainImage(productId);
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
            key: "producto",
            align: "center",
            render: (text, record) => {
              const detail = productDetails[record.productId];
              return detail && detail.product ? detail.product : "N/A";
            },
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

  // Render de cada orden en la lista, con el checkbox al inicio
  const renderOrderItem = (order) => {
    const orderTotal = order.products
      ? order.products.reduce(
          (acc, prod) => acc + Number(prod.unit_price) * Number(prod.units),
          0
        )
      : 0;
    return (
      <List.Item
        key={order.id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Checkbox
          checked={selectedOrderIds.includes(order.id)}
          onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
          style={{ marginRight: 8 }}
        />
        <div
          onClick={() => showOrderDetails(order)}
          style={{ cursor: "pointer", flex: 1, paddingLeft: 20 }}
        >
          <p>
            <strong>Pedido #{order.id}</strong>
          </p>
          <p>
            <strong>Fecha de compra:</strong> {formatDate(order.created_at)}
          </p>
          <p>
            <strong>Entrega programada:</strong>{" "}
            {formatDate(order.order_delivery_date)}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {order.status
              ? order.status
              : statusMap[String(order.order_status_id)] || "Desconocido"}
          </p>
          <p>
            <strong>Total:</strong> {formatCLP(orderTotal)}
          </p>
        </div>
        <Dropdown
          menu={{
            items: statusOptions.map((option) => ({
              key: option.key,
              label: option.label,
              onClick: () => updateOrderStatus(order.id, Number(option.key)),
            })),
          }}
          trigger={["click"]}
        >
          <Button>
            Cambiar Estado <DownOutlined />
          </Button>
        </Dropdown>
      </List.Item>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Checkbox
            onChange={handleSelectAll}
            checked={
              orders.length > 0 && selectedOrderIds.length === orders.length
            }
          >
            Seleccionar todos
          </Checkbox>
          <Button onClick={() => setSelectedOrderIds([])}>
            Desmarcar Seleccionados
          </Button>
        </div>
        <div>
          <Dropdown
            menu={{
              items: statusOptions.map((option) => ({
                key: option.key,
                label: option.label,
                onClick: () => confirmBulkUpdate({ key: option.key }),
              })),
            }}
            trigger={["click"]}
          >
            <Button>
              Cambiar Estado Seleccionados <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <List
        itemLayout="vertical"
        dataSource={orders}
        renderItem={renderOrderItem}
      />

      <Modal
        title={`Detalles del Pedido #${selectedOrder ? selectedOrder.id : ""}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedOrder(null);
        }}
        footer={[
          <Button key="user" onClick={() => setUserModalVisible(true)}>
            Ver Datos Usuario
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setModalVisible(false);
              setSelectedOrder(null);
            }}
          >
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
                {formatCLP(
                  selectedOrder.products
                    ? selectedOrder.products.reduce(
                        (acc, prod) =>
                          acc + Number(prod.unit_price) * Number(prod.units),
                        0
                      )
                    : 0
                )}
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
                  : statusMap[String(selectedOrder.order_status_id)] ||
                    "Desconocido"}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {renderUserModal()}
    </div>
  );
};

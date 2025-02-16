// frontend/src/components/admin/PedidosHistoricos.jsx
import { useState, useEffect } from "react";
import { Checkbox, Button, Dropdown, List, Modal, Table, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { formatCLP } from "../../helpers/formatPrice.helper";
import statusOptions from "../../data/statusOptions.json";
import { formatDateTimeChile } from "../../helpers/formatDateTimeChile.helper";

export const PedidosHistoricos = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Formatear fecha en DD-MM-YYYY
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Cargar pedidos históricos
  const fetchOrders = () => {
    if (session?.token) {
      setLoadingOrders(true);
      fetch(`${API_URL}/api/admin/orders/historical`, {
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
          // Filtrar pedidos con status Finalizada (order_status_id === 7)
          const historicos = data.filter(
            (order) => order.order_status_id === 7
          );
          historicos.sort((a, b) => b.id - a.id);
          setOrders(historicos);
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

  // Actualizar estado de orden individual
  const updateOrderStatus = (orderId, newStatus) => {
    fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ order_status_id: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar el estado");
        return res.json();
      })
      .then(() => {
        toast.success(
          `Pedido #${orderId} actualizado a "${
            statusOptions.find((opt) => opt.key === String(newStatus))?.label
          }"`,
          { position: "bottom-right" }
        );
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message, { position: "bottom-right" });
      });
  };

  // Bulk update
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

  const handleBulkUpdate = ({ key }) => {
    const newStatus = Number(key);
    Promise.all(
      selectedOrderIds.map((orderId) =>
        fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ order_status_id: newStatus }),
        })
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

  // Estado para detalles de producto
  const [productDetails, setProductDetails] = useState({});
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

  // Al abrir el modal, cargar los detalles de productos que no estén en caché.
  useEffect(() => {
    if (selectedOrder && selectedOrder.products) {
      setModalLoading(true);
      const idsToFetch = selectedOrder.products
        .map((prod) => prod.productId)
        .filter((id) => !productDetails[id]);
      if (idsToFetch.length > 0) {
        Promise.all(
          idsToFetch.map((id) =>
            fetch(`${API_URL}/api/products/${id}`, {
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
            setModalLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching product details:", err);
            setModalLoading(false);
          });
      } else {
        setModalLoading(false);
      }
    }
  }, [selectedOrder]);

  // Barra de herramientas (igual que antes)
  const renderToolbar = () => (
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
  );

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

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
              formatCLP(Number(record.unit_price) * Number(record.units)),
          },
        ]}
      />
    );
  };

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
            <strong>Entrega realizada:</strong>{" "}
            {formatDateTimeChile(order.updated_at)}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {order.status
              ? order.status
              : statusOptions.find(
                  (opt) => opt.key === String(order.order_status_id)
                )?.label || "Desconocido"}
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
        <Spin tip="Cargando pedidos históricos...">
          <div style={{ width: "350px", height: "150px" }} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="p-4">
      {renderToolbar()}
      {loadingOrders ? (
        <div className="flex justify-center items-center">
          <Spin tip="Cargando pedidos históricos...">
            <div style={{ width: "350px", height: "150px" }} />
          </Spin>
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={orders}
          renderItem={renderOrderItem}
        />
      )}

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
          <>
            {modalLoading ? (
              <Spin tip={`Cargando datos de la orden #${selectedOrder.id}`}>
                <div style={{ height: "300px" }} />
              </Spin>
            ) : (
              <div>
                {renderOrderProducts()}
                <div
                  className="mt-4 border-t pt-4"
                  style={{ textAlign: "center" }}
                >
                  <p>
                    <strong>Total de la compra:</strong>{" "}
                    {formatCLP(
                      selectedOrder.products
                        ? selectedOrder.products.reduce(
                            (acc, prod) =>
                              acc +
                              Number(prod.unit_price) * Number(prod.units),
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
                      : statusOptions.find(
                          (opt) =>
                            opt.key === String(selectedOrder.order_status_id)
                        )?.label || "Desconocido"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {renderUserModal()}
    </div>
  );
};

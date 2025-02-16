// frontend/src/pages/CartPage.jsx

import { Button, Card, List, Space, Typography, Image, Input } from "antd";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { formatCLP } from "../helpers/formatPrice.helper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [inputErrors, setInputErrors] = useState({}); // Manejo de errores por producto
  const navigate = useNavigate();

  const handleQuantityChange = (id, value) => {
    if (value === "" || isNaN(value)) return; // Permitir edición vacía sin error
    const numValue = parseInt(value, 10);

    if (numValue > 0) {
      updateQuantity(id, numValue);
      setInputErrors((prev) => ({ ...prev, [id]: false })); // Quitar error si es válido
    } else {
      setInputErrors((prev) => ({ ...prev, [id]: true })); // Marcar error
      toast.warning("Valor debe ser mayor que 0", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "dark",
        newestOnTop: true,
      });
    }
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    toast.info("Producto eliminado", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "dark",
      newestOnTop: true,
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: "24px", textAlign: "center" }}>
        Tu Carrito
      </Title>
      <Card>
        {cart.length === 0 ? (
          <Text type="secondary">Tu carrito está vacío</Text>
        ) : (
          <List
            dataSource={cart}
            renderItem={(item) => (
              <List.Item>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 4fr 2fr",
                    alignItems: "center",
                    width: "100%",
                    gap: "2rem",
                  }}
                >
                  {/* Se muestra la imagen principal (primera URL del arreglo 'images') */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Image
                      width={100}
                      height={100}
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : ""
                      }
                      alt={item.product}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <Space direction="vertical" style={{ flex: 1 }}>
                    <Text strong>{item.product}</Text>
                    <Text>
                      Precio: ${formatCLP(item.price.toFixed(2))} x{" "}
                      {item.quantity}
                    </Text>
                    <Text strong>
                      Total: ${formatCLP(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </Space>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        style={{ border: "1px solid black" }}
                      >
                        -
                      </Button>
                      <Input
                        type="text"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        onBlur={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        style={{
                          width: "50px",
                          textAlign: "center",
                          border: inputErrors[item.id]
                            ? "2px solid red"
                            : "1px solid black",
                        }}
                      />
                      <Button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={{ border: "1px solid black" }}
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      type="link"
                      danger
                      onClick={() => handleRemoveFromCart(item.id)}
                      style={{ marginTop: "8px" }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}

        {/* Total del carrito */}
        <div style={{ marginTop: "24px", textAlign: "right" }}>
          <Title level={4}>Total: ${total.toFixed(2)}</Title>
          <Button
            type="primary"
            size="large"
            disabled={cart.length === 0}
            onClick={() => navigate("/checkout")}
            style={{
              backgroundColor: "#F5E1A4",
              color: "#262011",
              borderColor: "#F5E1A4",
            }}
          >
            Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
};

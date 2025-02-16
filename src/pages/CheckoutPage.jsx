// frontend/src/pages/CheckoutPage.jsx

import { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Spin, Button } from "antd";
import { toast } from "react-toastify";

export const CheckoutPage = () => {
  const { cart } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();

  // Estado para las direcciones guardadas del usuario
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Estado para los datos del usuario y loading
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Estado para datos de contacto (email y phone)
  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
  });

  // Estado para el método de pago
  const [paymentMethod, setPaymentMethod] = useState("credito");

  // Estado para indicar que se está procesando la compra
  const [processingPurchase, setProcessingPurchase] = useState(false);

  // Cargar datos del usuario (GET /api/profile)
  useEffect(() => {
    if (session?.token) {
      setLoadingUserData(true);
      fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al cargar datos del usuario");
          }
          return res.json();
        })
        .then((data) => {
          setUserData(data.user);
          setLoadingUserData(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error al cargar datos del usuario", {
            position: "bottom-right",
          });
          setLoadingUserData(false);
        });
    }
  }, [session]);

  // Actualizar campos de contacto cuando userData esté disponible
  useEffect(() => {
    if (userData) {
      setContactData({
        email: userData.mail || "",
        phone: userData.phone || "",
      });
    }
  }, [userData]);

  // Cargar direcciones del usuario desde /api/address
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
          setAddresses(data);
          if (data && data.length > 0) {
            const mainAddr = data.find((addr) => addr.main);
            setSelectedAddress(mainAddr ? mainAddr.id : data[0].id);
          }
        })
        .catch((err) => {
          console.error("Error fetching addresses:", err);
          toast.error("Error al cargar direcciones", {
            position: "bottom-right",
          });
        });
    }
  }, [session]);

  // Calcular el total de la compra
  const totalPayment = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler para realizar la compra
  const handleRealizarCompra = async (e) => {
    e.preventDefault();
    setProcessingPurchase(true);

    // Validar que el usuario tenga RUT
    if (!userData || !userData.rut) {
      toast.error("Debes actualizar tus datos (RUT) para realizar la compra", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      setProcessingPurchase(false);
      return;
    }
    if (!selectedAddress) {
      toast.error("Debes seleccionar una dirección de envío", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      setProcessingPurchase(false);
      return;
    }

    // Calcular la fecha de entrega: hoy + 24 hrs (formato YYYY-MM-DD)
    const deliveryDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Obtener el objeto de la dirección seleccionada (snapshot)
    const selectedAddrObj = addresses.find(
      (addr) => addr.id === selectedAddress
    );

    const payload = {
      id_address: selectedAddress,
      order_delivery_date: deliveryDate,
      order_status_id: 1, // Estado inicial: "En revisión"
      order_address: selectedAddrObj ? selectedAddrObj.address : "",
      order_city: selectedAddrObj ? selectedAddrObj.city : "",
      order_region: selectedAddrObj ? selectedAddrObj.region : "",
      order_postal_code: selectedAddrObj ? selectedAddrObj.postal_code : "",
      order_phone: contactData.phone,
      items: cart.map((item) => ({
        productId: item.id,
        units: item.quantity,
        unit_price: item.price,
      })),
      payment_method: paymentMethod,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.details && Array.isArray(errorData.details)) {
            errorData.details.forEach((detail) => {
              const prod = cart.find((item) => item.id === detail.productId);
              if (prod) {
                toast.error(
                  `${prod.product} no tiene suficiente stock. Prueba con menos cantidad.`,
                  {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "dark",
                  }
                );
              }
            });
          }
          navigate("/cart");
          setProcessingPurchase(false);
          return;
        }
        throw new Error("Error al procesar la orden");
      }
      navigate("/success");
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setProcessingPurchase(false);
    }
  };

  if (loadingUserData) {
    return (
      <div className="flex justify-center items-center">
        <Spin tip="Cargando los datos del usuario...">
          <div style={{ width: "350px", height: "150px" }} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-3 gap-4">
        {/* Panel Izquierdo: Datos de envío, contacto y método de pago */}
        <div className="col-span-2 bg-white p-6 border border-gray-300 rounded-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              {userData && userData.name
                ? `Hola, ${userData.name}`
                : "Hola, Usuario"}
            </h2>
            <p className="mb-2 text-gray-700">Elige una dirección de envío:</p>
            <div className="space-y-2">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="form-radio"
                    />
                    <span>
                      {addr.province} - {addr.city} - {addr.address}
                      {addr.postal_code ? ` - ${addr.postal_code}` : ""}
                      {addr.main && " (Principal)"}
                    </span>
                  </label>
                ))
              ) : (
                <p>No tienes direcciones registradas.</p>
              )}
            </div>
          </div>

          {/* Datos de contacto */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Confirma tus datos de contacto
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleContactChange}
                  disabled
                  className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700">
                  Teléfono:
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleContactChange}
                  placeholder="Número de teléfono"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>

          {/* Mensaje de entrega */}
          <div className="mb-6">
            <p className="text-gray-600 italic">
              La entrega se realizará en 24 hrs hábiles.
            </p>
          </div>

          {/* Método de pago */}
          <div className="mb-6">
            <hr className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Elige tu método de pago
            </h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credito"
                  checked={paymentMethod === "credito"}
                  onChange={() => setPaymentMethod("credito")}
                  className="form-radio"
                />
                <span>Tarjeta Crédito</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="debito"
                  checked={paymentMethod === "debito"}
                  onChange={() => setPaymentMethod("debito")}
                  className="form-radio"
                />
                <span>Tarjeta Débito</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transferencia"
                  checked={paymentMethod === "transferencia"}
                  onChange={() => setPaymentMethod("transferencia")}
                  className="form-radio"
                />
                <span>Transferencia electrónica</span>
              </label>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Resumen de Compra */}
        <div className="col-span-1 bg-white p-6 border border-gray-300 rounded-lg flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-center">
            Resumen de Compra
          </h3>
          <div className="flex-1 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <p>No hay productos en el carrito.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center space-x-2">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : ""
                      }
                      alt={item.product}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold truncate">
                        {item.product}
                      </p>
                      <p className="text-xs text-gray-600">x {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold">
                      ${item.price.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">${totalPayment.toFixed(2)}</span>
            </div>
          </div>
          <Button
            onClick={handleRealizarCompra}
            loading={processingPurchase}
            type="primary"
            size="large"
            disabled={cart.length === 0}
            style={{
              backgroundColor: "#F5E1A4",
              color: "#262011",
              borderColor: "#F5E1A4",
            }}
            className="mt-4 w-full"
          >
            Realizar Compra
          </Button>
        </div>
      </div>
    </div>
  );
};

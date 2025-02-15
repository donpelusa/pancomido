// src/pages/CheckoutPage.jsx

import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CheckoutPage = () => {
  const { cart } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();

  // Simula direcciones registradas
  const addresses = [
    { id: 1, label: "Casa - Calle Falsa 123, Caldera" },
    { id: 2, label: "Oficina - Av. Siempre Viva 456, Caldera" },
  ];
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);

  // Datos de contacto (prefijados con datos de sesión si existen)
  const [contactData, setContactData] = useState({
    email: session?.email || "",
    phone: session?.phone || "",
  });

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState("credito");

  // Calcula el total del carrito
  const totalPayment = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRealizarCompra = async (e) => {
    e.preventDefault();
    // Validar que el usuario tenga RUT
    if (!session?.rut) {
      toast.error("Debes actualizar tus datos (RUT) para realizar la compra", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const payload = {
      id_address: selectedAddress,
      order_delivery_date: "2025-03-01", // O generar dinámicamente la fecha
      order_address: "Dirección de ejemplo", // Reemplazar con el dato real
      order_city: "Ciudad de ejemplo",
      order_region: "Región de ejemplo",
      order_postal_code: "000000",
      order_phone: contactData.phone,
      items: cart.map((item) => ({
        productId: item.id,
        units: item.quantity,
        unit_price: item.price,
      })),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        // Manejar error según la respuesta (por ejemplo, stock insuficiente)
        throw new Error("Error al procesar la orden");
      }
      // Si la orden se procesa correctamente:
      navigate("/success");
    } catch (error) {
      console.error(error);
      // Mostrar error mediante toast o similar
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-3 gap-4">
        {/* Panel Izquierdo (2/3) */}
        <div className="col-span-2 bg-white p-6 border border-gray-300 rounded-lg">
          {/* Información del usuario y dirección */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              {session?.name ? `Hola, ${session.name}` : "Hola, Usuario"}
            </h2>
            <p className="mb-2 text-gray-700">Elige una dirección de envío:</p>
            <div className="space-y-2">
              {addresses.map((addr) => (
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
                  <span>{addr.label}</span>
                </label>
              ))}
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
                  placeholder="tu@correo.com"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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

          {/* Opciones de pago */}
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

        {/* Panel Derecho (1/3): Resumen del carrito */}
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
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold truncate">
                        {item.title}
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
          {/* Total de la compra */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">${totalPayment.toFixed(2)}</span>
            </div>
          </div>
          {/* Botón para realizar la compra */}
          <button
            onClick={handleRealizarCompra}
            className="mt-4 w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
          >
            Realizar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

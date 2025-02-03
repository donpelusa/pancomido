// src/pages/SuccessPage.jsx
import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

export const SuccessPage = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Limpia el carrito en el estado global
    clearCart();
    // Si persistes el carrito en localStorage, eliminarlo:
    localStorage.removeItem("cart");
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <h1 className="text-4xl font-bold mb-4 text-green-700">
        ¡Compra Exitosa!
      </h1>
      <p className="mb-8 text-lg text-green-600">
        Gracias por tu compra. Tu pedido ha sido procesado y será entregado en
        breve.
      </p>
      <button
        onClick={() => {
          // console.log("Navegando a home");
          navigate("/", { replace: true });
        }}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

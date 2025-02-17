// frontend/src/pages/SuccessPage.jsx

import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

export const SuccessPage = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Limpia el carrito y elimina la información en localStorage
    clearCart();
    localStorage.removeItem("cart");
  }, [clearCart]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[45.625rem] h-[21.875rem] bg-green-50 flex flex-col items-center justify-center border border-gray-300 rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-4 text-green-700 text-center">
        ¡Compra Exitosa!
      </h1>
      <p className="mb-8 text-lg text-green-600 text-center">
        Gracias por tu compra. Tu pedido ha sido procesado y será entregado en
        breve.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/", { replace: true })}
          className="px-6 py-3 bg-[#f5e1a4] text-black rounded hover:bg-[#e0d8a8] transition"
        >
          Volver al Inicio
        </button>
        <button
          onClick={() => navigate("/profile?tab=tab-02", { replace: true })}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Ver Pedido
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

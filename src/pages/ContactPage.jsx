// src/pages/ContactPage.jsx

import { useState } from "react";
import { showUniqueToast } from "../helpers/showUniqueToast.helper";
import "react-toastify/dist/ReactToastify.css";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación simple
    if (!formData.name || !formData.email || !formData.message) {
      showUniqueToast.error("Por favor, complete todos los campos", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    // Aquí podrías hacer la llamada a una API para enviar el mensaje
    // Simulamos el envío con un toast de éxito
    showUniqueToast.success("Mensaje enviado correctamente", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
    // Reseteamos el formulario
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="max-h-screen  flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Contáctanos</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5e1a4]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5e1a4]"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe tu mensaje aquí..."
              rows="4"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5e1a4]"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-[#f5e1a4] text-[#262011] p-2 rounded-md hover:bg-[#262011] hover:text-white transition duration-300"
            >
              Enviar Mensaje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

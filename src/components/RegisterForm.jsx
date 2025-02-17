// src/components/RegisterForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showUniqueToast } from "../helpers/showUniqueToast.helper";

export const RegisterForm = () => {
  const navigate = useNavigate();

  // Se definen los campos requeridos según el endpoint: name, lastname, mail, password.
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maneja los cambios en los inputs y actualiza el estado
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Construye el payload que se enviará al backend
  const buildPayload = () => {
    return {
      name: userData.firstName,
      lastname: userData.lastName,
      mail: userData.mail,
      password: userData.password,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = buildPayload();

    try {
      // Usamos la variable de entorno VITE_API_URL definida en el .env local.
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Revisamos si la respuesta no fue exitosa.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registro");
      }

      // Si el registro es exitoso...
      // Mostramos un toast de éxito y redirigimos al login.
      showUniqueToast.success("Registro exitoso. Ahora puedes iniciar sesión.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      navigate("/auth/login");
    } catch (error) {
      console.error("Registro fallido:", error);
      setError(
        error.message || "Hubo un problema con el registro. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={userData.firstName}
          onChange={handleOnChange}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div>

      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-700"
        >
          Apellido
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={userData.lastName}
          onChange={handleOnChange}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div>

      <div>
        <label
          htmlFor="mail"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="mail"
          name="mail"
          value={userData.mail}
          onChange={handleOnChange}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleOnChange}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded-md
                     hover:bg-gray-800 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-gray-900
                     transition-colors duration-300"
        >
          {loading ? "Registrando..." : "Regístrate"}
        </button>
      </div>
    </form>
  );
};

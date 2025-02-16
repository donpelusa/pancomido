// src/components/LoginForm.jsx

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginForm = () => {
  const { handleSession } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mail: login.email,
            password: login.password,
          }),
        }
      );

      const rawData = await response.text(); // 🔍 Leer la respuesta como texto primero
      let data;

      try {
        data = JSON.parse(rawData); // Intentar convertirlo a JSON
      } catch {
        data = rawData; // Si falla, dejarlo como texto
      }

      // console.log("🔍 Response Status:", response.status); // Debug
      // console.log("🔍 Data response:", data); // Debug

      if (!response.ok) {
        if (
          response.status === 401 &&
          typeof data === "string" &&
          data.includes("username or password is incorrect")
        ) {
          throw new Error("Datos incorrectos.\nPrueba nuevamente");
        } else if (response.status === 500) {
          throw new Error("Error en el servidor.\nIntenta más tarde");
        } else {
          throw new Error("Error desconocido en la autenticación.");
        }
      }

      // ✅ Si la autenticación es exitosa
      handleSession({
        ...login,
        token: data.token,
      });

      toast.success("Inicio de sesión exitoso", {
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

      navigate("/profile");
    } catch (err) {
      console.error("❌ Error en el login:", err.message);

      toast.error(err.message, {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Usuario
        </label>
        <input
          onChange={handleOnChange}
          type="text"
          id="email"
          name="email"
          value={login.email}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
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
          onChange={handleOnChange}
          type="password"
          id="password"
          name="password"
          value={login.password}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        >
          {loading ? "Ingresando..." : "Ingresa"}
        </button>
      </div>
    </form>
  );
};

// RegisterForm.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const { handleSession } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maneja los cambios en los inputs
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para separar el nombre completo en firstname y lastname
  const splitName = (fullName) => {
    const parts = fullName.trim().split(" ");
    return {
      firstname: parts[0] || "",
      lastname: parts.slice(1).join(" ") || "",
    };
  };

  // Función para construir el payload de registro
  const buildPayload = () => {
    const { firstname, lastname } = splitName(userData.name);
    return {
      email: userData.email,
      // Usamos el nombre de usuario igual al firstname o a name completo
      username: firstname.toLowerCase() || userData.email,
      password: userData.password,
      name: {
        firstname,
        lastname,
      },
      // En address asignamos el valor ingresado a city y street, completando con valores por defecto
      address: {
        city: userData.address,
        street: userData.address,
        number: 0,
        zipcode: "00000",
        geolocation: {
          lat: "0",
          long: "0",
        },
      },
      phone: userData.phone,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = buildPayload();

    try {
      const response = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      const data = await response.json();

      // Suponemos que la respuesta retorna los datos del usuario registrado.
      // Llamamos a handleSession para almacenar la sesión.
      handleSession(data);

      // Redirigimos al dashboard o a la ruta que consideres
      navigate("/profile");
    } catch (error) {
      console.error("Registro fallido:", error);
      setError("Hubo un problema con el registro. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre Completo
        </label>
        <input
          onChange={handleOnChange}
          type="text"
          id="name"
          name="name"
          value={userData.name}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          onChange={handleOnChange}
          type="email"
          id="email"
          name="email"
          value={userData.email}
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
          value={userData.password}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div>

      {/* <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Dirección
        </label>
        <input
          onChange={handleOnChange}
          type="text"
          id="address"
          name="address"
          value={userData.address}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div> */}

      {/* <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Teléfono
        </label>
        <input
          onChange={handleOnChange}
          type="text"
          id="phone"
          name="phone"
          value={userData.phone}
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          required
        />
      </div> */}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        >
          {loading ? "Registrando..." : "Regístrate"}
        </button>
      </div>
    </form>
  );
};

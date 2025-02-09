export const apiFetch = async (endpoint, options = {}) => {
  const API_BASE = import.meta.env.VITE_API_URL;
  // Si necesitas enviar el token (por ejemplo, obteniéndolo de algún estado o storage):
  const token = localStorage.getItem("USER_TOKEN"); // o extraerlo de la sesión
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}/api${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    // Manejo de errores: puedes personalizar el throw según el status
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en la API");
  }
  return response.json();
};

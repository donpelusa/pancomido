// ForgotPasswordPage.jsx
import { useState } from "react";
import { showUniqueToast } from "../helpers/showUniqueToast.helper";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la solicitud");
      showUniqueToast.success("Revisa tu correo para continuar", {
        position: "bottom-right",
      });
      // Opcional: redirige o limpia el formulario
    } catch (err) {
      showUniqueToast.error(err.message, { position: "bottom-right" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Restablecer contraseña</h2>
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Enviar solicitud</button>
    </form>
  );
};

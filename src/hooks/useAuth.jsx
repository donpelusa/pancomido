// src/hooks/useAuth.jsx

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import userTest from "../data/userTest.json"; // Importar el JSON con los usuarios de prueba

export const useAuth = () => {
  const { session, isLoading, handleSession, logout } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(session?.role || null);

  useEffect(() => {
    if (session?.username && !userRole) {
      // Buscar el usuario en userTest.json
      const foundUser = userTest.users.find(
        (user) => user.username === session.username
      );

      if (foundUser) {
        setUserRole(foundUser.role);
        handleSession({ ...session, role: foundUser.role }); // ✅ Actualiza el rol solo si es necesario
      }
    }
  }, [session]);

  return {
    session: { ...session, role: userRole }, // ✅ Retorna siempre el rol actualizado
    isLoading,
    handleSession,
    logout,
  };
};

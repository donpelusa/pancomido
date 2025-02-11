// src/context/AuthProvider.jsx

import { createContext, useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage";

// Creamos el contexto de autenticación
export const AuthContext = createContext();

// Función para decodificar el token JWT (solo el payload)
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Error decoding token", error);
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const { handleSetStorageSession, handleGetStorageSession } = useStorage();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al guardar la sesión, decodificamos el token para extraer datos (por ejemplo, role)
  const handleSession = (newSession) => {
    if (newSession.token) {
      const decoded = decodeToken(newSession.token);
      newSession = { ...newSession, ...decoded };
    }
    setSession(newSession);
    handleSetStorageSession(newSession);
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("USER_SESSION");
  };

  useEffect(() => {
    const storedSession = handleGetStorageSession();
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error("Error parsing stored session:", error);
        setSession(null);
      }
    }
    setIsLoading(false);
  }, [handleGetStorageSession]);

  return (
    <AuthContext.Provider value={{ session, isLoading, handleSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

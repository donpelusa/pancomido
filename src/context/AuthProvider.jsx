// // frontend/src/context/AuthProvider.jsx

import { createContext, useState, useCallback } from "react";
import { useStorage } from "../hooks/useStorage";
import CryptoJS from "crypto-js";
const { VITE_CRYPTOJS_SECRET } = import.meta.env;

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

// Función para intentar restaurar la sesión de forma síncrona
const getInitialSession = () => {
  const storedEncrypted = localStorage.getItem("USER_SESSION");
  if (storedEncrypted) {
    try {
      const decryptedData = CryptoJS.AES.decrypt(
        storedEncrypted,
        String(VITE_CRYPTOJS_SECRET)
      ).toString(CryptoJS.enc.Utf8);
      if (decryptedData) {
        const parsedSession = JSON.parse(decryptedData);
        if (parsedSession.token) {
          const decoded = decodeToken(parsedSession.token);
          return { ...parsedSession, ...decoded };
        }
        return parsedSession;
      }
    } catch (error) {
      console.error("Error restoring session:", error);
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  // Inicializa la sesión de forma síncrona
  const [session, setSession] = useState(() => getInitialSession());
  // Si ya tenemos la sesión, ya no estamos "cargando"
  const [isLoading, setIsLoading] = useState(false);

  const { handleSetStorageSession } = useStorage();

  const handleSession = (newSession) => {
    if (newSession.token) {
      const decoded = decodeToken(newSession.token);
      newSession = { ...newSession, ...decoded };
    }
    setSession(newSession);
    handleSetStorageSession(newSession);
  };

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem("USER_SESSION");
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, handleSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

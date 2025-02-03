import { createContext, useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage";
import userTest from "../data/userTest.json"; // ✅ Importamos usuarios de prueba

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { handleSetStorageSession, handleGetStorageSession, decrypted } =
    useStorage();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSession = (newSession) => {
    // console.log("Sesion antes de asignar rol:", newSession); // 🔍 Debug

    // 🔥 **Forzar la actualización del rol antes de guardar la sesión**
    const foundUser = userTest.users.find(
      (user) => user.username === newSession.email
    );

    const updatedSession = {
      ...newSession,
      role: foundUser ? foundUser.role : "customer", // ✅ Ahora sí toma el rol correcto
    };

    // console.log("Sesion guardada en AuthProvider:", updatedSession); // 🔍 Debug

    setSession(updatedSession);
    handleSetStorageSession(updatedSession); // ✅ Guardar en almacenamiento local
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("session");
  };

  useEffect(() => {
    const storedSession = handleGetStorageSession();
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        const foundUser = userTest.users.find(
          (user) => user.username === parsedSession.email
        );

        const finalSession = {
          ...parsedSession,
          role: foundUser ? foundUser.role : "customer", // ✅ Asegurar rol correcto
        };

        // console.log("Sesion recuperada en AuthProvider:", finalSession); // 🔍 Debug

        setSession(finalSession);
      } catch (error) {
        console.error("Error al analizar la sesión almacenada:", error);
        setSession(null);
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, handleSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

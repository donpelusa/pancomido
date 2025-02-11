// src/hooks/useAuth.jsx

import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const { session, isLoading, handleSession, logout } = useContext(AuthContext);

  return {
    session,
    isLoading,
    handleSession,
    logout,
  };
};

// src/guard/AuthGuard.jsx

import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const AuthGuard = ({ children, isAllow, redirectTo = "/login" }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAllow) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};

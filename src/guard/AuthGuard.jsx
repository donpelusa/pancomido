// frontend/src/guard/AuthGuard.jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const AuthGuard = ({
  children,
  isAllow,
  redirectTo = "/auth/login",
}) => {
  const { isLoading } = useAuth();

  // Mientras la sesión se está recuperando, mostramos un loader
  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "100vh" }}
      >
        Loading...
      </div>
    );
  }

  if (!isAllow) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};

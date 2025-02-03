import { useAuth } from "../hooks/useAuth";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { AuthGuard } from "../guard/AuthGuard";
import { Page404 } from "../pages/Page404";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RegisterPage } from "../pages/RegisterPage";
import { SuccessPage } from "../pages/SuccessPage";
import { CatalogPage } from "../pages/CatalogPage";
import { ProductPage } from "../pages/ProductPage"; // Importar ProductPage
import { ContactPage } from "../pages/ContactPage"; // Importa la nueva página de contacto
import { roles } from "../helpers/roles";

export const RouterManager = () => {
  const { session } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="*" element={<Page404 />} />

        {/* Rutas de Autenticación */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Rutas de Usuario con MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="contact" element={<ContactPage />} />{" "}
          {/* Nueva ruta para ContactPage */}
          {/* Rutas protegidas por sesión */}
          <Route
            path="profile"
            element={
              <AuthGuard redirectTo="/auth/login" isAllow={session?.token}>
                <ProfilePage />
              </AuthGuard>
            }
          />
        </Route>

        {/* Rutas Exclusivas para Administrador */}
        {session?.role === roles.admin && (
          <Route path="/admin" element={<MainLayout />}></Route>
        )}
      </Routes>
    </Router>
  );
};

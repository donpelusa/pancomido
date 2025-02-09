// src/layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";
import { Marques } from "../components/Marques";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Credits } from "../components/Credits";
import { useAuth } from "../hooks/useAuth";

export const MainLayout = () => {
  const { session } = useAuth(); // Obtener sesión
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mostrar Marques solo si no hay sesión iniciada */}
      {!session?.token && <Marques />}
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* Aquí se renderizan las páginas */}
      </main>
      <Footer />
      <Credits />
    </div>
  );
};

// src/pages/ProfilePage.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Importa tus componentes Customer
import { MiCuenta } from "../components/customer/MiCuenta";
import { MisPedidos } from "../components/customer/MisPedidos";
import { MisDirecciones } from "../components/customer/MisDirecciones";
import { MisDatos } from "../components/customer/MisDatos";
import { MisFavoritos } from "../components/customer/MisFavoritos";

// Importa los componentes Admin
import { ResumenTienda } from "../components/admin/ResumenTienda";
import { EditarCatalogo } from "../components/admin/EditarCatalogo";
import { PedidosPendientes } from "../components/admin/PedidosPendientes";
import { PedidosHistoricos } from "../components/admin/PedidosHistoricos";
import { EditarUsuarios } from "../components/admin/EditarUsuarios";

export const ProfilePage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mi-cuenta");

  // ✅ Esperar a que la sesión se cargue antes de redirigir
  useEffect(() => {
    if (!session || !session.role) {
      navigate("/"); // Redirigir al Home si no hay sesión o rol inválido
    }
  }, [session, navigate]);

  const isAdmin = session?.role === "admin";

  const tabs = isAdmin
    ? [
        { key: "tab-01", label: "Resumen Tienda", content: <ResumenTienda /> },
        {
          key: "tab-02",
          label: "Editar Catálogo",
          content: <EditarCatalogo />,
        },
        {
          key: "tab-03",
          label: "Pedidos Pendientes",
          content: <PedidosPendientes />,
        },
        {
          key: "tab-04",
          label: "Pedidos Históricos",
          content: <PedidosHistoricos />,
        },
        {
          key: "tab-05",
          label: "Editar Usuarios",
          content: <EditarUsuarios />,
        },
      ]
    : [
        { key: "tab-01", label: "Mi cuenta", content: <MiCuenta /> },
        { key: "tab-02", label: "Mis pedidos", content: <MisPedidos /> },
        {
          key: "tab-03",
          label: "Mis direcciones",
          content: <MisDirecciones />,
        },
        { key: "tab-04", label: "Mis datos", content: <MisDatos /> },
        { key: "tab-05", label: "Mis favoritos", content: <MisFavoritos /> },
      ];

  // ✅ Validar si session aún no se ha cargado completamente
  if (!session || session.role === undefined) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  return (
    <div className="flex max-h-screen bg-gray-100">
      <aside className="w-1/4 bg-gray-300 p-4 border-r border-black">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                className={`w-full p-3 text-left border border-black ${
                  activeTab === tab.key ? "bg-white font-bold" : "bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="w-3/4 p-6 bg-white border-l border-black">
        <h2 className="text-xl font-bold mb-4">
          {tabs.find((t) => t.key === activeTab)?.label}
        </h2>
        {tabs.find((t) => t.key === activeTab)?.content}
      </main>
    </div>
  );
};

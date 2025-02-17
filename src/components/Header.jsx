// src/components/Header.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart"; // Solo importamos useCart
import { FiLogOut } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import logo from "../assets/images/logoWeb_cortado.png";
import { HeaderSearch } from "../components/SearchBar";
import { showUniqueToast } from "../helpers/showUniqueToast.helper";

export const Header = () => {
  const { session, logout } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpia el carrito
    clearCart();
    localStorage.removeItem("cart");

    // Llama a logout y muestra la notificación
    logout();
    showUniqueToast.info("Sesión de usuario cerrada", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "dark",
      newestOnTop: true,
    });
    setTimeout(() => {
      navigate("/");
    }, 200);
  };

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  return (
    <header className="bg-[#F5E1A4] text-[#262011] p-4">
      <div className="grid grid-cols-4 items-center h-[10rem] max-w-[80rem] mx-auto">
        <div className="flex justify-center items-center h-full col-span-1">
          <Link to="/">
            <img src={logo} alt="Pan Comido" className="h-35" />
          </Link>
        </div>
        <div className="grid grid-rows-2 gap-2 h-full w-full col-span-3">
          <div className="flex justify-center items-center gap-6">
            <HeaderSearch />
            <Link
              to={session?.token ? "/profile" : "/auth/login"}
              className="text-lg border border-black p-2 rounded-md font-semibold flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 transition"
              style={{ width: "7.5rem", height: "3rem" }}
            >
              {session?.token ? "Perfil" : "Login"}{" "}
              <LuUserRound className="ml-2 text-2xl hover:text-gray-700 transition" />
            </Link>
            {session?.token && (
              <button
                onClick={handleLogout}
                className="text-lg border border-black p-2 rounded-md font-semibold flex text-center items-center justify-center text-black hover:bg-red-100 hover:text-gray-700 transition duration-300 cursor-pointer"
                style={{ width: "7.5rem", height: "3rem" }}
              >
                Logout{" "}
                <FiLogOut
                  size={20}
                  className="ml-2 hover:text-gray-700 transition"
                />
              </button>
            )}
            <Link
              to="/cart"
              className="text-lg border border-black p-2 rounded-md font-semibold flex items-center justify-center relative hover:bg-gray-100 hover:text-gray-700 transition"
              style={{ width: "7.5rem", height: "3rem" }}
            >
              {totalItems > 0 ? (
                <>
                  <IoCartOutline className="text-2xl mr-1 hover:text-gray-700 transition" />{" "}
                  ({totalItems})
                </>
              ) : (
                <>
                  Carrito{" "}
                  <IoCartOutline className="text-2xl ml-1 hover:text-gray-700 transition" />
                </>
              )}
            </Link>
          </div>
          <nav className="flex justify-center items-center gap-6 text-[#262011] text-2xl w-full font-semibold">
            <Link
              to="/catalog"
              className="transition hover:underline underline-offset-14"
            >
              Catálogo
            </Link>
            <Link
              to="/contact"
              className="transition hover:underline underline-offset-14"
            >
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

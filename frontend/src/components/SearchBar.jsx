import { useState, useEffect, useRef } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNavigate, useLocation } from "react-router-dom";

export const HeaderSearch = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "🔎 Buscar productos..."
  );
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Resetea la barra de búsqueda cada vez que cambie la ubicación (navegación)
  useEffect(() => {
    setSearchValue("");
    setShowSuggestions(false);
    setSearchPlaceholder("🔎 Buscar productos...");
  }, [location]);

  // Actualiza las sugerencias dinámicamente en función del searchValue
  useEffect(() => {
    if (searchValue.trim() === "") {
      setSuggestions([]);
    } else {
      const lowerQuery = searchValue.toLowerCase();
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(lowerQuery)
      );
      setSuggestions(filtered);
    }
  }, [searchValue, products]);

  // Maneja la navegación al hacer click en una sugerencia
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchValue("");
    setShowSuggestions(false);
    setSearchPlaceholder("🔎 Buscar productos...");
  };

  // Navega al catálogo filtrado según el query
  const handleViewCatalog = () => {
    navigate(`/catalog?search=${encodeURIComponent(searchValue)}`);
    setShowSuggestions(false);
  };

  // Manejamos la tecla Enter para disparar el filtrado y quitar el foco del input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleViewCatalog();
      // Quita el foco del input para que desaparezca el cursor
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <div
      className={`relative bg-white p-2 border border-black w-80 h-12 flex justify-center ${
        showSuggestions ? "rounded-t-lg" : "rounded-lg"
      }`}
      ref={containerRef}
    >
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        placeholder={searchPlaceholder}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (searchValue.trim() === "") {
            setSearchPlaceholder("");
          }
          if (searchValue.trim() !== "") {
            setShowSuggestions(true);
          }
        }}
        onBlur={() => {
          setTimeout(() => {
            setShowSuggestions(false);
          }, 150);
          if (searchValue.trim() === "") {
            setSearchPlaceholder("🔎 Buscar productos...");
          }
        }}
        onKeyDown={handleKeyDown}
        className="w-full text-center text-black border-none focus:outline-none focus:ring-0 bg-transparent p-2"
      />

      {showSuggestions &&
        searchValue.trim() !== "" &&
        suggestions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 top-full bg-white border border-black rounded-b-md max-h-60 overflow-y-auto">
            {suggestions.slice(0, 4).map((product) => (
              <li
                key={product.id}
                onMouseDown={() => handleSuggestionClick(product.id)}
                className="cursor-pointer p-2 hover:bg-[#F5E1A4] border-b border-gray-300 last:border-0 truncate whitespace-nowrap overflow-hidden"
              >
                {product.title}
              </li>
            ))}
            <li
              onMouseDown={handleViewCatalog}
              className="cursor-pointer p-2 text-center font-semibold text-[#262011] bg-gray-200 hover:bg-[#F5E1A4] truncate whitespace-nowrap overflow-hidden"
            >
              Ver coincidencias en Catálogo
            </li>
          </ul>
        )}
    </div>
  );
};

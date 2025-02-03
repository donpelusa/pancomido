import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Categories } from "../components/Categories";
import { useProducts } from "../hooks/useProducts";
import { FaHeart, FaTimes } from "react-icons/fa";
import { Dropdown, Menu, Button } from "antd";

export const CatalogPage = () => {
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Extraemos los parámetros "search" y "category" de la URL
  const searchQuery = new URLSearchParams(location.search).get("search") || "";
  const categoryQuery =
    new URLSearchParams(location.search).get("category") || "";

  // Resetea el scroll al tope cuando se monta el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filtramos los productos según el query de búsqueda o categoría
  useEffect(() => {
    let filtered;
    if (categoryQuery.trim() !== "") {
      filtered = products.filter(
        (product) =>
          product.category.toLowerCase() === categoryQuery.toLowerCase()
      );
    } else if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = products.filter((product) =>
        product.title.toLowerCase().includes(lowerQuery)
      );
    } else {
      filtered = products;
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [categoryQuery, searchQuery, products]);

  // Función para el ordenamiento (se conserva la lógica ya implementada)
  const handleMenuClick = ({ key }) => {
    let sortedProducts = [...filteredProducts];
    switch (key) {
      case "a-z":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "max-min":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "min-max":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
    setCurrentPage(1);
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        { key: "a-z", label: "Ordenar de A a Z" },
        { key: "z-a", label: "Ordenar de Z a A" },
        { key: "max-min", label: "Ordenar de Mayor a Menor $" },
        { key: "min-max", label: "Ordenar de Menor a Mayor $" },
      ]}
    />
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tag que indica el filtro activo (prioriza categoría sobre búsqueda)
  let activeFilterTag = null;
  if (categoryQuery.trim() !== "") {
    activeFilterTag = (
      <div
        className="flex items-center bg-[#262011] text-[#f5e1a4] px-3 py-1 rounded-full cursor-pointer"
        onClick={() => navigate("/catalog")}
      >
        Filtrando por: "{categoryQuery}" <FaTimes className="ml-1" />
      </div>
    );
  } else if (searchQuery.trim() !== "") {
    activeFilterTag = (
      <div
        className="flex items-center bg-[#262011] text-[#f5e1a4] px-3 py-1 rounded-full cursor-pointer"
        onClick={() => navigate("/catalog")}
      >
        Filtrando por: "{searchQuery}" <FaTimes className="ml-1" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-3xl font-semibold">Catálogo de Productos</h2>
      {/* Categorías */}
      <Categories />

      {/* Resultados y Filtros */}
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center gap-4">
          <div
            style={{
              backgroundColor: "#fff2d2",
              color: "#000",
              borderColor: "#ffcc00",
              fontSize: "16px",
              height: "3rem",
            }}
            className="bg-gray-300 p-2 border border-black rounded-md flex items-center"
          >
            Resultados: {filteredProducts.length} productos
          </div>
          {activeFilterTag}
        </div>
        <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
          <Button
            style={{
              backgroundColor: "#fff2d2",
              color: "#000",
              borderColor: "#ffcc00",
              fontSize: "16px",
              height: "3rem",
            }}
            className="bg-gray-300 p-2 border-black"
          >
            Ordenar
          </Button>
        </Dropdown>
      </div>

      {/* Grilla de Productos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="p-4 relative block hover:bg-gray-100 transition duration-200 rounded-2xl"
          >
            <FaHeart className="absolute top-2 right-2 text-black cursor-pointer" />
            <div className="bg-white w-full h-68 flex items-center justify-center border border-black p-4 rounded-2xl">
              <img
                src={product.image}
                alt={product.title}
                className="h-full object-contain"
              />
            </div>
            <p className="mt-2 font-semibold">{product.title}</p>
            <p className="text-gray-600">${product.price}</p>
          </Link>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-8 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 border border-black ${
              currentPage === index + 1
                ? "bg-[#262011] text-[#f5e1a4]"
                : "bg-[#f5e1a4] text-[#262011]"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

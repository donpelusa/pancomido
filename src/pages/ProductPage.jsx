// src/pages/ProductPage.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../helpers/fakeStoreAPI"; // Simulación de datos
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth"; // Para acceder a la sesión
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ProductPage = () => {
  const { id } = useParams(); // Obtener ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(""); // Imagen principal
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { session } = useAuth(); // Obtenemos la sesión actual

  useEffect(() => {
    getProducts().then((products) => {
      const foundProduct = products.find((p) => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image); // Definir la imagen principal
      }
    });
  }, [id]);

  if (!product)
    return <p className="text-center mt-10">Cargando producto...</p>;

  const handleImageChange = (newImage) => {
    setSelectedImage(newImage);
  };

  const handleQuantityChange = (value) => {
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = () => {
    // Verificar si el usuario tiene sesión iniciada
    if (!session?.token) {
      toast.info("Para agregar al carro, inicia sesión", {
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
      return;
    }
    // Si existe sesión, agregar al carrito
    addToCart(product, quantity);
    toast.success("Producto agregado al carro", {
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
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Breadcrumb navegable */}
      <div className="p-2 text-xl mb-12">
        <span>
          <Link to="/catalog" className="hover:underline">
            CATÁLOGO
          </Link>{" "}
          /{" "}
          <Link
            to={`/catalog?category=${encodeURIComponent(product.category)}`}
            className="hover:underline"
          >
            {product.category.toUpperCase()}
          </Link>{" "}
          / <span>{product.title}</span>
        </span>
      </div>

      {/* Sección principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen principal */}
        <div className="flex justify-center">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-auto h-100 border border-black p-10"
          />
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>

          <p
            className={`mt-4 font-semibold ${
              product.rating.count > 0 ? "text-green-600" : "text-gray-600"
            }`}
          >
            {product.rating.count > 0 ? "En stock" : "Sin stock"}
          </p>

          <p className="text-2xl font-bold mt-2">${product.price.toFixed(3)}</p>

          {/* Controles de cantidad y botón de agregar */}
          <div className="flex items-center mt-4">
            <button
              className="bg-gray-300 px-3 py-1 border border-black"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              onBlur={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              className="w-12 h-8 text-center border border-black mx-2"
            />
            <button
              className="bg-gray-300 px-3 py-1 border border-black"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </button>
            <button
              className="bg-black text-white px-4 py-2 ml-4"
              onClick={handleAddToCart}
            >
              AGREGAR
            </button>
          </div>

          {/* Miniaturas de imágenes */}
          <div className="flex mt-6 gap-4">
            {[product.image, product.image, product.image].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className="w-20 h-20 border border-black cursor-pointer object-contain object-center p-1"
                onClick={() => handleImageChange(img)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Descripción del producto e información nutricional */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-8">
        {/* Descripción */}
        <div>
          <h2 className="text-xl font-bold">Descripción del producto</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
        </div>

        {/* Información Nutricional */}
        <div>
          <h2 className="text-xl font-bold">Información Nutricional</h2>
          <div className="w-full h-40 bg-gray-300 border border-black mt-2 flex items-center justify-center">
            <p className="text-gray-700">Tabla nutricional</p>
          </div>
        </div>
      </div>

      {/* Productos similares */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">Productos similares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="w-full h-40 bg-gray-300 border border-black flex items-center justify-center"
            >
              <p className="text-gray-700">IMAGEN</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

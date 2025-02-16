// frontend/src/pages/ProductPage.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatCLP } from "../helpers/formatPrice.helper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { session } = useAuth();

  // Reinicia la cantidad al cambiar de producto
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  // Cargar detalles del producto
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener el producto");
        }
        const data = await response.json();
        setProduct(data);
        setImageArray(data.images && data.images.length > 0 ? data.images : []);
        if (data.related && data.related.length > 0) {
          const shuffled = data.related.sort(() => 0.5 - Math.random());
          setRelatedProducts(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el producto");
      }
    };

    fetchProductDetail();
  }, [id]);

  if (!product)
    return <p className="text-center mt-10">Cargando producto...</p>;

  const mainImage = imageArray[0];
  const thumbnails = imageArray.slice(1, 4);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) {
      toast.warning("No hay más unidades disponibles para agregar", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.warning("Producto no disponible, sin stock", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    if (!session?.token) {
      toast.info("Para agregar al carro, inicia sesión", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    addToCart(product, quantity);
    toast.success("Producto agregado al carro", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
    setQuantity(1);
  };

  const handleThumbnailClick = (index) => {
    const newArray = [...imageArray];
    const temp = newArray[0];
    newArray[0] = newArray[index + 1];
    newArray[index + 1] = temp;
    setImageArray(newArray);
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Breadcrumb */}
      <div className="p-2 text-xl mb-12">
        <span>
          <Link to="/catalog" className="hover:underline">
            CATÁLOGO
          </Link>{" "}
          /{" "}
          {product.categories && product.categories.length > 0 && (
            <Link
              to={`/catalog?category=${encodeURIComponent(
                product.categories[0]
              )}`}
              className="hover:underline"
            >
              {product.categories[0].toUpperCase()}
            </Link>
          )}{" "}
          / <span>{product.product}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen principal */}
        <div className="flex justify-center">
          <div
            className="p-4"
            style={{ width: "31.25rem", height: "31.25rem" }}
          >
            <img
              src={mainImage}
              alt={product.product}
              className="object-cover rounded-md shadow-2xl w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-105"
            />
          </div>
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold">{product.product}</h1>
          <div className="pt-4">
            <h3 className="text-lg font-semibold">Ingredientes</h3>
            <ul className="text-gray-600 mt-2 list-disc pl-5">
              {product.ingredients.split("\n").map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <p
            className={`mt-4 font-semibold ${
              product.stock > 0 ? "text-green-600" : "text-gray-600"
            }`}
          >
            {product.stock > 0 ? "En stock" : "Sin stock"}
          </p>
          <p className="text-2xl font-bold mt-2">{formatCLP(product.price)}</p>

          <div className="flex items-center mt-4 space-x-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="bg-gray-300 px-3 py-1 border border-black"
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
              className="w-12 h-8.5 text-center border border-black"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="bg-gray-300 px-3 py-1 border border-black"
            >
              +
            </button>
            <button
              onClick={handleAddToCart}
              className={`bg-black text-white px-4 py-2 ml-4 rounded-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              AGREGAR
            </button>
          </div>

          <div className="flex mt-6 gap-4">
            {thumbnails.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-[10rem] h-[10rem] object-cover rounded-md shadow-2xl cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de descripción e información nutricional */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-8">
        <div>
          <h2 className="text-xl font-bold">Descripción del producto</h2>
          <p className="text-gray-600 mt-2 whitespace-pre-wrap">
            {product.description}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Información Nutricional</h2>
          <div className="mt-2 p-4 border border-gray-300 rounded">
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.nutrition}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Productos similares</h2>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {relatedProducts.map((item) => {
              const relatedMainImage =
                item.url_img ||
                (item.images && item.images.length > 0
                  ? typeof item.images[0] === "string"
                    ? item.images[0]
                    : item.images[0].secure_url ||
                      item.images[0].url ||
                      item.images[0].url_img ||
                      ""
                  : "");
              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="relative rounded-md overflow-hidden group aspect-square"
                >
                  <div className="w-full h-full">
                    {relatedMainImage ? (
                      <img
                        src={relatedMainImage}
                        alt={item.product}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                    <p className="text-white text-center text-s truncate">
                      {item.product}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

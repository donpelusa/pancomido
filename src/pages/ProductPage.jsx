// src/pages/ProductPage.jsx

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
  // Usamos un estado único para el arreglo de imágenes
  const [imageArray, setImageArray] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { session } = useAuth();

  // Cargar el detalle del producto
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
        // Asumimos que data.images es un arreglo de objetos y usamos todos
        if (data.images && data.images.length > 0) {
          setImageArray(data.images);
        } else {
          setImageArray([]);
        }
        // Cargar productos relacionados (4 al azar)
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

  // La imagen principal es la primera del arreglo
  const mainImage = imageArray[0];
  // Las miniaturas son el resto (solo se muestran hasta 3)
  const thumbnails = imageArray.slice(1, 4);

  // Manejo de cambio de cantidad, validando que no supere el stock disponible
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

  // Agregar producto al carrito
  const handleAddToCart = () => {
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
  };

  // Función para intercambiar la imagen principal con una miniatura
  const handleThumbnailClick = (index) => {
    // index corresponde a la posición dentro de thumbnails, pero en imageArray es index+1
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
        {/* Imagen principal con efecto zoom al hover */}
        <div className="flex justify-center">
          <div className="overflow-hidden border border-black p-4">
            <img
              src={mainImage}
              alt={product.product}
              className="transition-transform duration-300 ease-in-out transform hover:scale-105"
            />
          </div>
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold">{product.product}</h1>
          {/* Se muestra los ingredientes en lugar de description */}
          <p className="text-gray-600 mt-2">{product.ingredients}</p>

          {/* Mostrar stock: se valida con product.stock */}
          <p
            className={`mt-4 font-semibold ${
              product.stock > 0 ? "text-green-600" : "text-gray-600"
            }`}
          >
            {product.stock > 0 ? "En stock" : "Sin stock"}
          </p>

          {/* Precio formateado en CLP */}
          <p className="text-2xl font-bold mt-2">{formatCLP(product.price)}</p>

          {/* Controles de cantidad y botón agregar */}
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
              className="w-12 h-8 text-center border border-black"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="bg-gray-300 px-3 py-1 border border-black"
            >
              +
            </button>
            {/* Botón "Agregar" con efecto hover usando Ant Design */}
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-4 py-2 ml-4 transition-colors duration-200 hover:bg-gray-800"
            >
              AGREGAR
            </button>
          </div>

          {/* Miniaturas de imágenes (en el mismo orden que en ProductForm) */}
          <div className="flex mt-6 gap-4">
            {thumbnails.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Miniatura ${index + 1}`}
                className="w-20 h-20 border border-black cursor-pointer object-contain p-1"
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de descripción e información nutricional */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-8">
        {/* Descripción del producto: usamos el campo description de la API */}
        <div>
          <h2 className="text-xl font-bold">Descripción del producto</h2>
          <p className="text-gray-600 mt-2 whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        {/* Información Nutricional: mostramos el campo nutrition */}
        <div>
          <h2 className="text-xl font-bold">Información Nutricional</h2>
          <div className="mt-2 p-4 border border-gray-300 rounded">
            {/* Si el contenido de nutrition es largo, se puede hacer scroll */}
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.nutrition}
            </p>
          </div>
        </div>
      </div>

      {/* Productos similares */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Productos similares</h2>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {relatedProducts.map((item) => {
              // Si existe url_img, se usa directamente. De lo contrario, se intenta extraer
              // la imagen desde el arreglo de imágenes, tal como se hace en Favoritos.
              const mainImage =
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
                  {/* Tarjeta de imagen */}
                  <div className="w-full h-full">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={item.product}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  {/* Contenedor semitransparente con el nombre del producto */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                    <p className="text-white text-semibold text-center truncate">
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

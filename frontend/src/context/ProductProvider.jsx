import { createContext, useState, useEffect } from "react";
import { getProducts } from "../helpers/fakeStoreAPI"; // Importar la API de productos

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Cargar productos desde Fake Store API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getProducts();
        setProducts(productData); // Guardar productos en el estado global
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

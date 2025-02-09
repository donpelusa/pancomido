// src/hooks/useProducts.jsx

import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductProvider";
import { getProducts } from "../helpers/fakeStoreAPI"; // 🔹 Importación corregida

export const useProducts = () => {
  const { products, setProducts } = useContext(ProductContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!products.length) {
      getProducts().then((data) => {
        setProducts(data);
        setLoading(false);
      });
      // getProducts().then(console.log).catch(console.error);
    } else {
      setLoading(false);
    }
  }, [products, setProducts]);

  return { products, loading };
};

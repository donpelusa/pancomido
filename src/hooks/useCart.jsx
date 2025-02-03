// src/hooks/useCart.jsx
import { useContext, useCallback } from "react";
import { CartContext } from "../context/CartProvider";

export const useCart = () => {
  const { cart, setCart } = useContext(CartContext);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return; // No permitir valores negativos
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};

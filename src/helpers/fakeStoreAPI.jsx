export const getCategories = async () => {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    if (!response.ok) {
      throw new Error("Error al obtener categorías");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Error fetching products");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

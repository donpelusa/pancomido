// src/components/Categories.jsx
import { getCategories } from "../helpers/fakeStoreAPI"; // Simulación de datos
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (category) => {
    // Navega a /catalog con el parámetro category y elimina cualquier search previo.
    navigate(`/catalog?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="my-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 pb-4 rounded-lg w-full">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="cursor-pointer p-4 bg-[#F5E1A4] rounded-lg flex justify-center items-center text-center font-semibold"
          >
            {category}
          </div>
        ))}
      </div>
    </section>
  );
};

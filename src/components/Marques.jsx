// src/components/Marques.jsx

import { Link } from "react-router-dom";

export const Marques = () => {
  return (
    <Link to="/auth/register" className="block w-full">
      <section className="bg-[#F5E1A4] text-[#262011] w-full">
        {/* Marquesina */}
        <div className="text-center text-sm bg-[#262011] text-[#F5E1A4] p-2 w-full font-bold">
          <p>
            🔥 ¡Oferta especial por tiempo limitado! Regístrate y obtén un 10%
            de descuento 🔥
          </p>
        </div>
      </section>
    </Link>
  );
};

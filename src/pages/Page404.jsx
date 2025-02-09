// src/pages/Page404.jsx

import { Fragment } from "react";
import { Link } from "react-router-dom";
import pancito404 from "../assets/images/pancito_404.png";

export const Page404 = () => {
  return (
    <Fragment>
      <section className="h-screen w-full flex flex-col justify-center items-center bg-[#F5E1A4]">
        <img src={pancito404} alt="Pancito perdido" className="w-36" />
        <h1 className="text-9xl font-extrabold text-white tracking-widest">
          404
        </h1>
        <div className="bg-[#262011] px-2 text-white text-sm rounded mt-4">
          Nos perdimos en el horno
        </div>
        <Link
          to="/"
          className="mt-15 relative inline-block text-sm font-medium text-white group active:text-orange-500 focus:outline-none focus:ring"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#262011] group-hover:translate-y-0 group-hover:translate-x-0 rounded-xl"></span>
          <span className="relative block px-8 py-3 bg-white border border-current rounded-xl text-[#262011]">
            Inicio
          </span>
        </Link>
      </section>
    </Fragment>
  );
};

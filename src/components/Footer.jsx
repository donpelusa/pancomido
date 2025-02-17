// src/components/Footer.jsx

import logo from "../assets/images/logoRedondo_cortado.png";
import { FaInstagram } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";

export const Footer = () => {
  return (
    <footer className="bg-[#F5E1A4] text-[#262011] text-left p-4 mt-8 flex items-center">
      <div className="flex items-center gap-4 w-full max-w-[80rem] mx-auto justify-center">
        {/* Logo */}
        <img src={logo} alt="Pan Comido Logo" className="h-24" />

        {/* Divisor */}
        <div className="h-16 ml-10 w-[2px] bg-[#262011]"></div>

        {/* Texto */}
        <div className="ml-10">
          <p className="font-bold">Pan Comido</p>
          <p>Panadería artesanal en Caldera, Atacama</p>
          <p className="flex items-center gap-2">
            <SlLocationPin className="text-current ml-1" />
            Dirección:{" "}
            <a
              href="https://maps.app.goo.gl/1Ej2EUwZqAXNQrc58"
              target="_blank"
              className="text-inherit hover:underline"
            >
              Selin Alvarado 935, Caldera, Atacama
            </a>
          </p>
          <p className="flex items-center gap-2">
            <LuPhone className="text-current ml-1" />
            Teléfono:{" "}
            <a
              href="https://wa.me/56992800156"
              target="_blank"
              className="text-inherit hover:underline"
            >
              +56 9 9280 0156
            </a>
          </p>
          <p className="flex items-center gap-2">
            <MdOutlineMailOutline className="text-current ml-1" />
            Email:{" "}
            <a
              href="mailto:lapancomido@gmail.com"
              target="_blank"
              className="text-inherit hover:underline"
            >
              lapancomido@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-2">
            <FaInstagram className="text-current ml-1" />
            Link:{" "}
            <a
              href="https://www.instagram.com/lapancomido/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-inherit hover:underline"
            >
              <span>https://www.instagram.com/lapancomido/</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// src/components/Footer.jsx

import logo from "../assets/images/logoRedondo_cortado.png";

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
          <p>📍 Dirección: Selin Alvarado 935, Caldera, Atacama</p>
          <p>📞 Teléfono: +56 9 9280 0156</p>
          <p>📧 Email: lapancomido@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

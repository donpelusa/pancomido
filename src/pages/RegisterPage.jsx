// src/pages/RegisterPage.jsx
import { RegisterForm } from "../components/RegisterForm";
import { Link } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook, FaApple } from "react-icons/fa";
import promoData from "../data/promo.json";

export const RegisterPage = () => {
  const promoVideo = new URL(
    `../assets/videos/${promoData.register}`,
    import.meta.url
  ).href;

  return (
    <div className="flex items-center justify-center max-h-screen p-4">
      <div className="w-full max-w-[850px] bg-white rounded-xl shadow-lg overflow-hidden max-h-[35rem]">
        {/* Usamos flex y items-stretch para que ambas columnas tengan el mismo alto */}
        <div className="flex flex-col lg:flex-row items-stretch h-full">
          {/* Columna izquierda: formulario de registro */}
          <div className="w-full lg:w-1/2 p-10">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Registro
            </h1>
            {/* Botones de acceso rápido */}
            {/* <div className="mt-4 flex flex-col lg:flex-row items-center gap-2">
              <button
                type="button"
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <FcGoogle size={20} /> Google
              </button>
              <button
                type="button"
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <FaFacebook size={20} className="text-blue-600" /> Facebook
              </button>
              <button
                type="button"
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <FaApple size={20} className="text-black" /> Apple
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>o con tu correo</p>
            </div> */}
            <RegisterForm />
          </div>
          {/* Columna derecha: video, que se ajusta al alto de la columna izquierda */}
          <div className="hidden lg:flex lg:w-1/2">
            <div className="w-full h-full">
              <video
                src={promoVideo}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

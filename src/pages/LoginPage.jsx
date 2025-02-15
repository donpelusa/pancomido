// src/pages/LoginPage.jsx

import { LoginForm } from "../components/LoginForm";
import { Link } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook, FaApple } from "react-icons/fa";
import promoData from "../data/promo.json";

export const LoginPage = () => {
  const promoVideo = new URL(
    `../assets/videos/${promoData.login}`,
    import.meta.url
  ).href;

  return (
    <div
      className="flex items-center justify-center"
      // Altura total disponible luego de descontar header/footer:
      // Calc(100vh - (190px + 180px)) => 100vh - 370px
      // Esto mantiene un espacio fijo para header y footer.
      style={{ height: "calc(100vh - 400px)" }}
    >
      {/* 
        Contenedor con relación de aspecto 17/10 (~850/500). 
        max-w-[53.125rem] (850px/16) y max-h-[31.25rem] (500px/16) 
        para que no crezca más de lo deseado, pero sea responsive.
      */}
      <div className="aspect-[17/10] w-full max-w-[53.125rem] max-h-[31.25rem] overflow-hidden rounded-xl">
        <div className="flex w-full h-full">
          {/* Sección del video */}
          <div className="hidden lg:flex w-1/2 items-center justify-center bg-white text-black">
            <video
              src={promoVideo}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sección del login */}
          <div className="w-full lg:w-1/2 bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
              <h1 className="text-3xl font-semibold mb-6 text-black text-center">
                Inicia Sesión
              </h1>
              {/* Botones de acceso rápido */}
              {/* <div className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-2">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md 
                             hover:bg-gray-50 border border-gray-200 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 
                             transition-colors duration-300"
                >
                  <FcGoogle size={20} /> Google
                </button>

                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md 
                             hover:bg-gray-50 border border-gray-200 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 
                             transition-colors duration-300"
                >
                  <FaFacebook size={20} className="text-blue-600" /> Facebook
                </button>

                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md 
                             hover:bg-gray-50 border border-gray-200 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 
                             transition-colors duration-300"
                >
                  <FaApple size={20} className="text-black" /> Apple
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>o con tu correo</p>
              </div> */}

              <LoginForm />

              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  ¿Aún no tienes cuenta?{" "}
                  <Link
                    to="/auth/register"
                    className="text-black hover:underline"
                  >
                    Regístrate Aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

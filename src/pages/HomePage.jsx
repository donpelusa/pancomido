// src/pages/HomePage.jsx

import { useEffect, useState } from "react";

/* Import Swiper */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* Importar JSON Data */
import slidesData from "../data/slides.json";
import imagesData from "../data/images.json";
import promoData from "../data/promo.json";

/* Importar Categorías FakeAPI */
import { getCategories } from "../helpers/getProductData.helper"; // Simulación de datos
import { Categories } from "../components/Categories";

/* Importar Framer Motion */
import { motion } from "framer-motion";

export const HomePage = () => {
  /* Lógica randomización Productos BentoGrid*/
  const [images, setImages] = useState([]);
  useEffect(() => {
    const shuffled = imagesData.images.sort(() => 0.5 - Math.random());
    setImages(shuffled.slice(0, 9));
  }, []);

  /* Lógica Categorías */
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const promoVideo = new URL(
    `../assets/videos/${promoData.promo}`,
    import.meta.url
  ).href;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4">
        {/* Galería / Slider */}
        <section className="my-8">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            speed={1800} /* Velocidad de la transición en milisegundos */
            loop={true} /* Hace que el carrusel sea infinito */
            loopAdditionalSlides={
              3
            } /* Carga más slides en el loop para evitar saltos */
            centeredSlides={
              false
            } /* Evita que una slide esté centrada al inicio */
            watchOverflow={true} /* Evita problemas cuando hay pocas slides */
            className="w-full h-[24rem] rounded-lg overflow-hidden"
            style={{ "--swiper-theme-color": "#262011" }}
          >
            {slidesData.slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <img
                  src={
                    new URL(`../assets/images/${slide.image}`, import.meta.url)
                      .href
                  }
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Categorías */}
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <Categories />

        {/* Productos Bento Grid */}
        <h2 className="text-xl font-bold mb-4">Productos</h2>
        <section className="my-8 flex justify-center">
          <div
            className="grid gap-4 max-w-[120rem] max-h-[35rem]"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(3, 1fr)",
              gridTemplateAreas: `
            "a a b c"
            "d e e f"
            "g h i i"
          `,
              width: "120rem",
              height: "55rem",
            }}
          >
            {images.map((img, index) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden shadow-lg"
                style={{
                  gridArea: ["a", "b", "c", "d", "e", "f", "g", "h", "i"][
                    index
                  ],
                }}
                whileHover={{ scale: 1.05 }} // Aumenta un 5% el tamaño al hacer hover
                transition={{ duration: 1.2, ease: "easeInOut" }} // Animación lenta de 1.2s
              >
                <img
                  src={new URL(`../assets/images/${img}`, import.meta.url).href}
                  alt={`Producto ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Elígenos */}
        <section className="my-8 grid grid-cols-3 gap-8 items-center mt-20">
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">Elígenos</h2>
            <p>
              En el corazón del puerto de Caldera, nace &quot;La Pan
              Comido&quot;, una micro-panadería online que revoluciona la forma
              en que se disfruta del pan. Nuestro objetivo es ofrecer un pan
              sano y beneficioso para la salud, elaborado con masa madre y un
              proceso de fermentación que dura 17 horas, lo que le da un sabor y
              una textura únicos.
              <br />
              <br />
              Respetamos las recetas más tradicionales de pan, utilizando
              técnicas y ingredientes que han sido perfeccionados a lo largo de
              los años. Nuestros panes son el resultado de un proceso de
              elaboración que dura 2 días, desde el amasado hasta la salida del
              horno, lo que nos permite ofrecer un producto de alta calidad y
              sabor auténtico.
              <br />
              <br />
              Fundada en el año 2020, &quot;La Pan Comido&quot; se ha convertido
              en una referencia para aquellos que buscan un pan auténtico y
              delicioso. Nos enfocamos en ofrecer un producto que se asemeja a
              la tradición de las panaderías italianas, donde el pan es un arte
              y una pasión.
            </p>
          </div>
          <div className="w-full h-90">
            <video
              src={promoVideo}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              loop
              muted
            ></video>
          </div>
        </section>
      </main>
    </div>
  );
};

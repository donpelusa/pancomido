import React, { useEffect } from "react";

export const Credits = () => {
  // Inyecta el link de Google Fonts para "Fira Code"
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="bg-[#111a28] text-white text-center text-xs p-1 font-mono">
      <p style={{ fontFamily: '"Fira Code", monospace' }}>
        Desarrollado por{" "}
        <a
          href="https://www.alvarocortes.cl"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationColor: "transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecorationColor = "white")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.textDecorationColor = "transparent")
          }
        >
          Alvaro <span style={{ textDecoration: "underline" }}>#Pelusa</span>{" "}
          Cortés
        </a>{" "}
        © {new Date().getFullYear()}
      </p>
    </div>
  );
};

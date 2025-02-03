export const Credits = () => {
  return (
    <div className="bg-[#111a28] text-white text-center text-xs p-1 font-mono">
      <p className="font-[Fira_Sans]">
        Desarrollado por{" "}
        <a
          href="https://www.alvarocortes.cl"
          target="_blank"
          className="font-bold underline decoration-transparent hover:decoration-white"
        >
          Alvaro <span className="underline">#Pelusa</span> Cortés
        </a>{" "}
        © {new Date().getFullYear()}
      </p>
    </div>
  );
};

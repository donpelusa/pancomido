import { useAuth } from "../../hooks/useAuth";

export const MiCuenta = () => {
  const { session } = useAuth();

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">
        Bienvenido, {session?.name || "Usuario"}
      </h3>
      <p className="mb-4">Email: {session?.email || "No definido"}</p>
      <h4 className="text-lg font-semibold mb-2">Compras recientes:</h4>
      <ul className="list-disc ml-6">
        {/* Aquí podrías mapear tus compras recientes */}
        <li>Compra #1234 - Estado: Enviado</li>
        <li>Compra #1235 - Estado: En proceso</li>
        <li>Compra #1236 - Estado: Cancelada</li>
      </ul>
    </div>
  );
};

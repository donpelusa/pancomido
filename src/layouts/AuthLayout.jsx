import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Credits } from "../components/Credits";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Outlet />
      </main>
      <Footer />
      <Credits />
    </div>
  );
};

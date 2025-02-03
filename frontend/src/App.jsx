import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";
import { RouterManager } from "./router/RouterManager";
import { CartProvider } from "./context/CartProvider";
import { ProductProvider } from "./context/ProductProvider";

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <RouterManager />
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  clientId:
    "AcNPEiudggmUbeuLnxu6XnjbPGgabDixkwS_aFALvrbQIYrjIPKuCJowJYD4R4N473Q9boQRnSLEya7N",
  currency: "USD",
  intent: "capture",
};

const App: React.FC = () => {
  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <div className="relative min-h-screen ">
          <Routes>
            <Route path="/login" Component={Login} />
            <Route path="/" Component={Home} />
            <Route path="/products" Component={Products} />
            <Route path="/products/:productAlias" Component={ProductDetail} />

            <Route Component={ProtectedRoute}>
              <Route path="/cart" Component={Cart} />
              <Route path="/checkout" Component={Checkout} />
              <Route path="/order" Component={Order} />
            </Route>
          </Routes>
        </div>
        <Toaster />
      </PayPalScriptProvider>
    </>
  );
};

export default App;

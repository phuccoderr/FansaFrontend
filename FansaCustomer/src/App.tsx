import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";

const App: React.FC = () => {
  return (
    <>
      <div className="relative min-h-screen ">
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/" Component={Home} />
          <Route path="/products" Component={Products} />
          <Route path="/products/:productAlias" Component={ProductDetail} />

          <Route Component={ProtectedRoute}>
            <Route path="/cart" Component={Cart} />
          </Route>
        </Routes>
      </div>
      <Toaster />
    </>
  );
};

export default App;

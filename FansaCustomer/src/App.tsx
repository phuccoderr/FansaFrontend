import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

const App: React.FC = () => {
  return (
    <>
      <div className="relative min-h-screen ">
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/" Component={Home} />
          <Route path="/products" Component={Products} />
          <Route path="/products/:productAlias" Component={ProductDetail} />
        </Routes>
      </div>
      <Toaster />
    </>
  );
};

export default App;

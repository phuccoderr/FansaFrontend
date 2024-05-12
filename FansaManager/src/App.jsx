import { ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./theme";
import ProSidebar from "./pages/global/ProSidebar";
import Topbar from "./pages/global/Topbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import CssBaseline from "@mui/material/CssBaseline";
import Users from "./pages/users/Users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./pages/login/ProtectedRoute";
import UpdateUser from "./pages/users/form/UpdateUser";
import Categories from "./pages/category/Categories";
import Account from "./pages/users/form/Account";
import CreateUser from "./pages/users/form/CreateUser";
import CreateCategory from "./pages/category/CreateCategory";
import UpdateCategory from "./pages/category/UpdateCategory";
import Error from "./pages/Error";
import Products from "./pages/product/Products";
import CreateProduct from "./pages/product/CreateProduct";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UpdateProduct from "./pages/product/UpdateProduct";

function App() {
  const [theme, colorMode] = useMode();
  const queryClient = new QueryClient();
  let user =
    localStorage.getItem("user") != null
      ? JSON.parse(localStorage.getItem("user"))
      : "";

  const roleAccess = user?.roles?.some((role) => role.name === "ADMIN");

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            <div className="app">
              <ProSidebar />
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path="/" Component={Dashboard} />
                  <Route path="/login" Component={Login} />
                  <Route path="/403" Component={Error} />
                  <Route
                    element={
                      <ProtectedRoute user={user} isAccess={roleAccess} />
                    }
                  >
                    <Route path="/users" Component={Users} />
                    <Route path="/user" Component={CreateUser} />
                    <Route path="/users/:userId" Component={UpdateUser} />
                    <Route path="/account" Component={Account} />
                    <Route path="/categories" Component={Categories} />
                    <Route path="/category" Component={CreateCategory} />
                    <Route
                      path="/categories/:cateId"
                      Component={UpdateCategory}
                    />
                    <Route path="/products" Component={Products} />
                    <Route path="/product" Component={CreateProduct} />
                    <Route
                      path="/products/:productId"
                      Component={UpdateProduct}
                    />
                  </Route>
                </Routes>
              </main>
            </div>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;

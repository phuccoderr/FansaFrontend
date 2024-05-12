import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ user, isAccess }) {
  // if (!isAccess) {
  //   return <Navigate to="/403" replace />;
  // }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

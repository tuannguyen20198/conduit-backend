import { getToken } from "@/lib/auth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = getToken();

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PublicRoute;

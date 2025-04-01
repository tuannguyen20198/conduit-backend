import { jsx as _jsx } from "react/jsx-runtime";
import { getToken } from "@/lib/auth";
import { Navigate, Outlet } from "react-router-dom";
const PublicRoute = () => {
    const token = getToken();
    return token ? _jsx(Outlet, {}) : _jsx(Navigate, { to: "/login", replace: true });
};
export default PublicRoute;

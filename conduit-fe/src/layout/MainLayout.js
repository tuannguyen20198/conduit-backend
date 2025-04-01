import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from "@/component/Header";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow-md p-4", children: _jsx("div", { className: "container mx-auto", children: _jsx(Header, {}) }) }), _jsx("main", { className: "container mx-auto p-6", children: _jsx(Outlet, {}) }), _jsx("footer", { className: "bg-gray-200 text-center p-4 mt-12", children: _jsx("p", { children: "\u00A9 2025 RealWorld Clone" }) })] }));
};
export default MainLayout;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
import { Link } from "react-router-dom";
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6", children: [_jsx("h1", { className: "text-4xl font-bold text-red-600", children: "Something went wrong!" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Please try again later." }), _jsx(Link, { to: "/", className: "mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600", children: "Go Home" })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;

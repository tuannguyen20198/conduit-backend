import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FormInput from "@/component/FormInput";
import SubmitButton from "@/component/SubmitButton";
import useLogin from "@/hook/useLogin";
import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
const Login = () => {
    const { error, methods, handleLogin, handleChange, formData, isPending } = useLogin();
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "container page", children: _jsx("div", { className: "row", children: _jsxs("div", { className: "col-md-6 offset-md-3 col-xs-12", children: [_jsx("h1", { className: "text-xs-center", children: "Sign in" }), _jsx("p", { className: "text-xs-center", children: _jsx(Link, { to: "/register", children: "Need an account?" }) }), error && (_jsx("ul", { className: "error-messages", children: _jsx("li", { children: error.response?.data?.errors?.["email or password"] || "Invalid credentials" }) })), _jsx(FormProvider, { ...methods, children: _jsxs("form", { onSubmit: handleLogin, children: [_jsx(FormInput, { type: "email", name: "email", placeholder: "Email", value: formData.email, onChange: handleChange }), _jsx(FormInput, { type: "password", name: "password", placeholder: "Password", value: formData.password, onChange: handleChange }), isPending ? _jsx(SubmitButton, { label: "Sign in..." }) : _jsx(SubmitButton, { label: "Sign in" })] }) })] }) }) }) }));
};
export default Login;

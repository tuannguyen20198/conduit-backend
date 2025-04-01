import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FormInput from "@/component/FormInput";
import { FormProvider } from "react-hook-form";
import SubmitButton from "@/component/SubmitButton";
import useRegister from "@/hook/useRegister";
const Register = () => {
    const { methods, handleSubmit, isPending } = useRegister();
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "container page", children: _jsx("div", { className: "row", children: _jsxs("div", { className: "col-md-6 offset-md-3 col-xs-12", children: [_jsx("h1", { className: "text-xs-center", children: "Sign up" }), _jsx("p", { className: "text-xs-center", children: _jsx("a", { href: "/login", children: "Have an account?" }) }), methods.formState.errors.server && (_jsx("ul", { className: "error-messages", children: _jsx("li", { children: String(methods.formState.errors.server.message) }) })), _jsx(FormProvider, { ...methods, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(FormInput, { type: "text", name: "username", placeholder: "Username" }), _jsx(FormInput, { type: "email", name: "email", placeholder: "Email" }), _jsx(FormInput, { type: "password", name: "password", placeholder: "Password" }), isPending ? _jsx(SubmitButton, { label: "Sign in..." }) : _jsx(SubmitButton, { label: "Sign in" })] }) })] }) }) }) }));
};
export default Register;

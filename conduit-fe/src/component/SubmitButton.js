import { jsx as _jsx } from "react/jsx-runtime";
import { useFormContext } from "react-hook-form";
const SubmitButton = ({ label }) => {
    const { formState: {}, } = useFormContext();
    return (_jsx("button", { className: "btn btn-lg btn-primary", type: "submit", children: label }));
};
export default SubmitButton;

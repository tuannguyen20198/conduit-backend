import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SettingsForm = ({ formData, isChanged, handleChange, handleSubmit, error }) => {
    return (_jsx("form", { onSubmit: handleSubmit, children: _jsxs("fieldset", { children: [error && _jsx("div", { className: "alert alert-danger", children: error }), ["image", "username", "bio", "email", "password"].map((field) => (_jsx("fieldset", { className: "form-group", children: field === "bio" ? (_jsx("textarea", { className: "form-control form-control-lg", rows: 8, name: "bio", value: formData.bio, onChange: handleChange, placeholder: "Short bio about you" })) : (_jsx("input", { className: "form-control form-control-lg", type: field === "password" ? "password" : "text", name: field, value: formData[field], onChange: handleChange, placeholder: field === "password"
                            ? "New Password (leave blank if not changing)"
                            : `Your ${field.charAt(0).toUpperCase() + field.slice(1)}` })) }, field))), _jsx("button", { className: "btn btn-lg btn-primary pull-xs-right", type: "submit", disabled: !isChanged, children: "Update Settings" })] }) }));
};
export default SettingsForm;

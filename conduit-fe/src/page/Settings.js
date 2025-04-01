import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SettingsForm from "@/component/SettingForms";
const Settings = ({ formData, isChanged, handleChange, handleSubmit, error }) => {
    return (_jsx("div", { className: "settings-page", children: _jsxs("div", { className: "container page", children: [_jsx("h1", { children: "Your Settings" }), _jsx(SettingsForm, { formData: {
                        ...formData,
                        image: formData.image || "" // Đảm bảo image không bị undefined 
                    }, isChanged: isChanged, handleChange: handleChange, handleSubmit: handleSubmit, error: error })] }) }));
};
export default Settings;

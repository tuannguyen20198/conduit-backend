import { jsx as _jsx } from "react/jsx-runtime";
import { useSettings } from "@/hook/useSettings";
import Settings from "./Settings";
const SettingsPage = () => {
    const { formData, error, isChanged, handleChange, handleSubmit } = useSettings();
    if (!formData)
        return _jsx("p", { children: "Loading user data..." });
    return (_jsx(Settings, { formData: { ...formData, password: formData.password || "" }, isChanged: isChanged, handleChange: handleChange, handleSubmit: handleSubmit, error: error }));
};
export default SettingsPage;

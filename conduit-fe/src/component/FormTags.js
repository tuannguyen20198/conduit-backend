import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const FormTags = ({ onTagsChange, setError, clearErrors }) => {
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const addTag = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault(); // Ngăn form submit
            if (tags.includes(inputValue.trim())) {
                setError("tags", { type: "duplicate", message: "Tag already exists." });
                return;
            }
            const newTags = [...tags, inputValue.trim()];
            setTags(newTags);
            onTagsChange(newTags);
            clearErrors("tags"); // ✅ Xóa lỗi nếu có
            setInputValue("");
        }
    };
    const removeTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        onTagsChange(newTags);
        if (newTags.length === 0) {
            setError("tags", { type: "required", message: "Tags is required" }); // ✅ Gán lỗi khi xóa hết tags
        }
    };
    useEffect(() => {
        if (tags.length === 0) {
            setError("tags", { type: "required", message: "Tags is required" }); // ✅ Gán lỗi khi xóa hết tags
        }
        else {
            clearErrors("tags"); // ✅ Xóa lỗi nếu có
        }
    }, [tags, setError, clearErrors]);
    return (_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Tags" }), _jsx("input", { type: "text", className: "form-control", placeholder: "Enter tags and press Enter", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: addTag }), tags.length > 0 && (_jsx("div", { className: "tag-list", style: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", alignItems: "center" }, children: tags.map((tag, index) => (_jsxs("span", { className: "tag-default tag-pill", children: [tag, " ", _jsx("i", { className: "ion-close-round", onClick: () => removeTag(index), style: { cursor: "pointer", marginLeft: "5px" } })] }, index))) }))] }));
};
export default FormTags;

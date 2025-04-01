import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormProvider } from "react-hook-form";
import FormInput from "./FormInput";
import FormTags from "./FormTags";
import SubmitButton from "./SubmitButton";
import useArticles from "@/hook/useArticles";
const ArticleForm = ({ onSubmit, apiErrors }) => {
    const { methods, handleSubmit, handleTagsChange, errors } = useArticles();
    return (_jsx(FormProvider, { ...methods, children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [apiErrors.length > 0 && (_jsx("ul", { className: "error-messages", children: apiErrors.map((err, index) => (_jsx("li", { className: "text-danger", children: err }, index))) })), _jsx(FormInput, { name: "title", placeholder: "Article Title" }), _jsx(FormInput, { name: "description", placeholder: "What's this article about?" }), _jsx(FormInput, { name: "body", placeholder: "Write your article", type: "markdown" }), _jsxs("fieldset", { className: "form-group", children: [_jsx(FormTags, { onTagsChange: handleTagsChange, setError: methods.setError, clearErrors: methods.clearErrors }), errors.tags && _jsx("p", { className: "text-danger", children: String(errors.tags.message) })] }), _jsx(SubmitButton, { label: "Publish Article" })] }) }));
};
export default ArticleForm;

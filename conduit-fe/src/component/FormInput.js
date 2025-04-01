import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useFormContext } from "react-hook-form";
import { lazy, Suspense } from "react";
import "@mdxeditor/editor/style.css";
import { toolbarPlugin, BoldItalicUnderlineToggles, BlockTypeSelect, InsertCodeBlock, ListsToggle, UndoRedo, headingsPlugin, } from "@mdxeditor/editor";
const MDXEditor = lazy(() => import("@mdxeditor/editor").then(mod => ({ default: mod.MDXEditor })));
// Modify the type for `onChange` to accept both HTMLInputElement and HTMLTextAreaElement events
const FormInput = ({ name, placeholder, type = "text", onChange, value }) => {
    const { register, setValue, watch, formState: { errors }, } = useFormContext();
    // Ensure inputValue is always a defined string
    const inputValue = watch(name) ?? value ?? ''; // Default to empty string if undefined
    // Handle change for both input and textarea elements
    const handleChange = (e) => {
        if (onChange) {
            onChange(e); // Call the passed onChange handler if it exists
        }
        const value = e.target.value?.trim() ?? ''; // Avoid undefined or null values
        setValue(name, value); // Update the form value using react-hook-form
    };
    return (_jsxs("fieldset", { className: "form-group w-full max-w-4xl mx-auto", children: [type === "markdown" ? (_jsx(Suspense, { fallback: _jsx("p", { children: "Loading editor..." }), children: _jsxs("div", { className: "relative form-control p-3 min-h-[300px] bg-white rounded border border-gray-300 w-full", children: [_jsx(MDXEditor, { markdown: inputValue || '', onChange: (val) => setValue(name, val || ''), plugins: [
                                headingsPlugin(),
                                toolbarPlugin({
                                    toolbarContents: () => (_jsxs(_Fragment, { children: [_jsx(UndoRedo, {}), _jsx(BoldItalicUnderlineToggles, {}), _jsx(BlockTypeSelect, {}), _jsx(InsertCodeBlock, {}), _jsx(ListsToggle, {})] })),
                                }),
                            ], className: "p-2 w-full bg-transparent outline-none relative z-20" }), !inputValue && (_jsx("div", { className: "absolute top-20 left-10 text-gray-400 pointer-events-none z-10", children: placeholder }))] }) })) : type === "textarea" ? (_jsx("textarea", { ...register(name, { required: `${name} is required` }), className: "form-control w-full", placeholder: placeholder, value: inputValue, onChange: handleChange })) : (_jsx("input", { ...register(name, { required: `${name} is required` }), type: type, className: "form-control w-full", placeholder: placeholder, value: inputValue, onChange: handleChange })), errors[name] && _jsx("p", { className: "text-danger", children: String(errors[name]?.message) })] }));
};
export default FormInput;

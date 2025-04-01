import { useFormContext } from "react-hook-form";
import { lazy, Suspense } from "react";
import "@mdxeditor/editor/style.css";
import {
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  InsertCodeBlock,
  ListsToggle,
  UndoRedo,
  headingsPlugin,
} from "@mdxeditor/editor";
import { FormInputProps } from "@/interfaces/form-input";

const MDXEditor = lazy(() => import("@mdxeditor/editor").then(mod => ({ default: mod.MDXEditor })));

// Modify the type for `onChange` to accept both HTMLInputElement and HTMLTextAreaElement events
const FormInput = ({ name, placeholder, type = "text", onChange, value }: FormInputProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Ensure inputValue is always a defined string
  const inputValue = watch(name) ?? value ?? ''; // Default to empty string if undefined

  // Handle change for both input and textarea elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e); // Call the passed onChange handler if it exists
    }
    const value = e.target.value?.trim() ?? ''; // Avoid undefined or null values
    setValue(name, value); // Update the form value using react-hook-form
  };

  return (
    <fieldset className="form-group w-full max-w-4xl mx-auto">
      {/* Handle markdown type */}
      {type === "markdown" ? (
        <Suspense fallback={<p>Loading editor...</p>}>
          <div className="relative form-control p-3 min-h-[300px] bg-white rounded border border-gray-300 w-full">
            <MDXEditor
              markdown={inputValue || ''} // Ensure markdown is a string
              onChange={(val) => setValue(name, val || '')} // Sync with react-hook-form
              plugins={[
                headingsPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <BlockTypeSelect />
                      <InsertCodeBlock />
                      <ListsToggle />
                    </>
                  ),
                }),
              ]}
              className="p-2 w-full bg-transparent outline-none relative z-20"
            />
            {/* Placeholder for empty markdown editor */}
            {!inputValue && (
              <div className="absolute top-20 left-10 text-gray-400 pointer-events-none z-10">
                {placeholder}
              </div>
            )}
          </div>
        </Suspense>
      ) : type === "textarea" ? (
        <textarea
          {...register(name, { required: `${name} is required` })} // Register with react-hook-form
          className="form-control w-full"
          placeholder={placeholder}
          value={inputValue} // Use the value from react-hook-form
          onChange={handleChange} // Use the custom handleChange function
        />
      ) : (
        <input
          {...register(name, { required: `${name} is required` })} // Register with react-hook-form
          type={type}
          className="form-control w-full"
          placeholder={placeholder}
          value={inputValue} // Use the value from react-hook-form
          onChange={handleChange} // Use the custom handleChange function
        />
      )}
      {/* Display error message */}
      {errors[name] && <p className="text-danger">{String(errors[name]?.message)}</p>}
    </fieldset>
  );
};

export default FormInput;

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

// Lười tải MDXEditor
const MDXEditor = lazy(() => import("@mdxeditor/editor").then(mod => ({ default: mod.MDXEditor })));

// Component FormInput với các loại input khác nhau
const FormInput = ({ name, placeholder, type = "text", onChange, value }: FormInputProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Lấy giá trị từ react-hook-form hoặc fallback giá trị mặc định
  const inputValue = watch(name) ?? value ?? ''; // Default to empty string if undefined

  // Hàm handleChange để cập nhật giá trị input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value; // Giữ nguyên giá trị nhập vào (không dùng trim)
    setValue(name, value); // Cập nhật giá trị vào form state
    if (onChange) {
      onChange(e); // Gọi handler onChange nếu có
    }
  };

  return (
    <fieldset className="form-group w-full max-w-4xl mx-auto">
      {/* Xử lý trường Markdown */}
      {type === "markdown" ? (
        <Suspense fallback={<p>Loading editor...</p>}>
          <div className="relative form-control p-3 min-h-[300px] bg-white rounded border border-gray-300 w-full">
            <MDXEditor
              markdown={inputValue || ''} // Đảm bảo markdown là chuỗi
              onChange={(val) => setValue(name, val || '')} // Đồng bộ hóa với react-hook-form
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
            {/* Placeholder cho trường markdown nếu rỗng */}
            {!inputValue && (
              <div className="absolute top-20 left-10 text-gray-400 pointer-events-none z-10">
                {placeholder}
              </div>
            )}
          </div>
        </Suspense>
      ) : type === "textarea" ? (
        <textarea
          {...register(name, { required: `${name} is required` })} // Đăng ký với react-hook-form
          className="form-control w-full"
          placeholder={placeholder}
          value={inputValue} // Lấy giá trị từ react-hook-form
          onChange={handleChange} // Gọi handleChange khi thay đổi
        />
      ) : type === "text" || type === "email" || type === "password" ? (
        <input
          {...register(name, { 
            required: `${name} is required`, 
            pattern: type === "email" ? {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address"
            } : undefined, // Email validation regex
          })} // Đăng ký với react-hook-form
          type={type} // Set type to text, email, or password
          className="form-control w-full"
          placeholder={placeholder}
          value={inputValue} // Lấy giá trị từ react-hook-form
          onChange={handleChange} // Gọi handleChange khi thay đổi
        />
      ) : null}

      {/* Hiển thị thông báo lỗi nếu có */}
      {errors[name] && <p className="text-danger">{String(errors[name]?.message)}</p>}
    </fieldset>
  );
};

export default FormInput;

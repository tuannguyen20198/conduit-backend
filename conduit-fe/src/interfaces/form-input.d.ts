export interface FormInputProps {
  name: string;
  placeholder?: string;
  type?: "text" | "textarea" | "markdown" | "password" | "email";
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string;
}

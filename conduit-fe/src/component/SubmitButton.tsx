import { SubmitButtonProps } from "@/interfaces/form-submit";
import { useFormContext } from "react-hook-form";



const SubmitButton = ({ label }: SubmitButtonProps) => {
  const {
    formState: {  },
  } = useFormContext();

  return (
    <button className="btn btn-lg btn-primary" type="submit" >
      {label}
    </button>
  );
};

export default SubmitButton;

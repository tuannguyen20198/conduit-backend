import FormInput from "@/component/FormInput";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import SubmitButton from "@/component/SubmitButton";
import useRegister from "@/hook/useRegister";

const Register = () => {
  const {methods, handleSubmit,isPending} = useRegister();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="/login">Have an account?</a>
            </p>

            {/* Hiển thị lỗi từ API */}
            {methods.formState.errors.server && (
              <ul className="error-messages">
                <li>{String(methods.formState.errors.server.message)}</li>
              </ul>
            )}

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit}>
                <FormInput type="text" name="username" placeholder="Username" />
                <FormInput type="email" name="email" placeholder="Email" />
                <FormInput type="password" name="password" placeholder="Password" />
                {isPending ? <SubmitButton label="Sign in..." /> : <SubmitButton label="Sign in" />}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

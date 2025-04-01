import FormInput from "@/component/FormInput";
import SubmitButton from "@/component/SubmitButton";
import { useAuth } from "@/context/AuthContext";
import useLogin from "@/hook/useLogin";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const {error, methods, handleLogin, handleChange,formData,isPending} = useLogin();
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>

            {error && (
              <ul className="error-messages">
                <li>{(error as any).response?.data?.errors?.["email or password"] || "Invalid credentials"}</li>
              </ul>
            )}

            <FormProvider {...methods}>
              <form onSubmit={handleLogin}>
                <FormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}  // This will now handle both input and textarea events
                />
                <FormInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}  // This will now handle both input and textarea events
                />
                {isPending ? <SubmitButton label="Sign in..." /> : <SubmitButton label="Sign in" />}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

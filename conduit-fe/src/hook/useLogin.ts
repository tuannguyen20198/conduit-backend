import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user } = useAuth();
  const methods = useForm();
  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      login(user);
      navigate("/", { replace: true });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    mutate(formData);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ email: "", password: "" });
  };
  const onSubmit = () => {
    setFormData({ email: "", password: "" });
    navigate("/register");
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (user) {
      navigate("/"); // Chuyển hướng về trang chủ nếu đã đăng nhập
    }
  }, [user, navigate]);

  return {
    formData,
    handleChange,
    handleSubmit,
    handleLogin,
    methods,
    isPending,
    error,
    user,
  };
};

export default useLogin;

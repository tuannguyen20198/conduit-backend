import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const useRegister = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const methods = useForm();
    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        onSuccess: (user) => {
            register(user);
            navigate("/");
        },
        onError: (error) => {
            if (error.response?.data?.errors) {
                const errorsObj = error.response.data.errors;
                methods.setError("server", {
                    message: Object.values(errorsObj).flat().join(", "),
                });
            }
            else {
                methods.setError("server", {
                    message: "Đăng ký thất bại, vui lòng thử lại!",
                });
            }
        },
    });
    const handleSubmit = methods.handleSubmit((data) => {
        mutate(data);
    });
    return {
        handleSubmit,
        methods,
        isPending,
    };
};
export default useRegister;

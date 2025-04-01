import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
export const useSettings = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const defaultFormData = {
        image: "",
        username: "",
        bio: "",
        email: "",
        password: "",
    };
    const [formData, setFormData] = useState(defaultFormData);
    const [error, setError] = useState(null);
    const [originalData, setOriginalData] = useState(defaultFormData);
    useEffect(() => {
        if (user) {
            const newUserData = {
                image: user.image || "",
                username: user.username || "",
                bio: user.bio || "",
                email: user.email || "",
                password: "",
            };
            setFormData(newUserData);
            setOriginalData(newUserData); // Cập nhật originalData để so sánh đúng
        }
    }, [user]);
    const isChanged = useMemo(() => {
        if (!formData || !originalData)
            return false;
        const { password, ...currentData } = formData;
        const { password: _, ...original } = originalData;
        return (JSON.stringify(currentData) !== JSON.stringify(original) ||
            (password ?? "").trim() !== "");
    }, [formData, originalData]);
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChanged)
            return;
        setError(null);
        const { password, ...updatedUserData } = formData;
        const finalData = password
            ? { ...updatedUserData, password }
            : updatedUserData;
        try {
            const response = await updateUser(finalData);
            console.log("✅ API response:", response);
            if (!response || !response.user) {
                throw new Error("Update failed: No user data returned.");
            }
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { ...storedUser, ...response.user };
            // 🛠 Lưu user vào localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            // 🛠 Cập nhật state trong context
            setUser(updatedUser);
            setOriginalData(response.user);
            if (password) {
                logout();
                navigate("/login");
            }
            else {
                navigate("/settings");
            }
        }
        catch (error) {
            console.error("❌ Update error:", error);
            setError("Update failed. Please try again.");
        }
    };
    return { formData, error, isChanged, handleChange, handleSubmit, user };
};

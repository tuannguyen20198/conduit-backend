import { jsx as _jsx } from "react/jsx-runtime";
import { getMe } from "@/lib/api";
import { createContext, useState, useContext, useEffect } from "react";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser.token) {
                console.error("Token is missing in stored user:", parsedUser);
            }
            setUser(parsedUser);
        }
    }, []);
    // Gọi API lấy user khi component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getMe();
                setUser(userData);
            }
            catch (error) {
                console.error("Failed to fetch user", error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);
    const login = (userData) => {
        if (!userData.user || !userData.user.token) {
            console.error("🚨 User data is missing or invalid!", userData);
            return;
        }
        console.log("✅ User data received:", userData);
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.user.token);
        setUser(userData.user);
    };
    const register = (userData) => {
        if (!userData.user || !userData.user.token) {
            console.error("🚨 User data is missing or invalid!", userData);
            return;
        }
        console.log("✅ User data received:", userData);
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.user.token);
        setUser(userData.user);
    };
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, setUser, login, register, logout }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
